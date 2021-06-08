const uuid = require('uuid/v4');
const express = require('express');
const http = require("http");
const socketIo = require('socket.io');
const bodyParser = require("body-parser");
const { Pool } = require("pg");
require("dotenv").config();
const cors = require("cors");
let jwt = require('jsonwebtoken');
const jsonParser = bodyParser.json();
const app = express();
app.use(cors());
app.use(jsonParser);

const port = process.env.PORT || 4001;
const port1 = 5000;

const server = http.createServer(app);
const io = socketIo(server);

const RacerStates = Object.freeze({
  WAITING: Symbol('RACER_STATE_WAITING'),
  IN_PROGRESS: Symbol('RACER_STATE_IN_PROGRESS'),
  FINISHED: Symbol('RACER_STATE_FINISHED'),
});

let dbParams = {};
if (process.env.DATABASE_URL) {
  dbParams.connectionString = process.env.DATABASE_URL;
} else {
  dbParams = {
    host: process.env.DB_HOST,
    port1: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    api: process.env.DB_GMAPS,
  };
}

const db = new Pool(dbParams);
db.connect();

let Util = require('./services/UtilityService');


app.post('/register', function(req, res) {

  let errorCheck = Util.checkForErrors(req.body);
  if(errorCheck.hasErrors){
    console.log('There were errors...');
    res.json(errorCheck.errors);
    return;
  }

  // create a sample user
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const queryParams = [username, email, password];
  const queryString = `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *`;
  db.query(queryString, queryParams)
      .then((result) => {
        res.json({
          success: true,
          data: result.rows[0]
        });
      })
      .catch((err) => res.json({success: false, data: err}));
});

let apiRoutes = express.Router();

let login = function(req, res) {
  const email = req.body.email;
  const queryParams = [
    email
  ];
  const queryString = `SELECT * FROM users WHERE email = $1;`;
  db.query(queryString, queryParams)
      .then((result) => {
        let user = result.rows[0];
        if (!user) {
          res.json({ success: false, message: 'Authentication failed. User not found.' });
        } else if (user) {

          if (user.password != req.body.password) {
            res.json({ success: false, message: 'Authentication failed. Wrong password.' });
          } else {

            let payload = {
              username: user.username,
              email: user.email
            }
            let token = jwt.sign(
                payload,
                process.env.JWT_KEY,
                { expiresIn: 86400 }      // expires in 24 hours
            );

            res.json({
              success: true,
              message: 'Enjoy your token!',
              token: token,
              data: user
            });
          }

        }
      })
      .catch((err) => console.log("ERRRRROR!", err));
}
apiRoutes.post('/authenticate', login);
apiRoutes.post('/login', login);

// ---------------------------------------------------------
// route middleware to authenticate and check token
// ---------------------------------------------------------
apiRoutes.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  let token = req.body.token || req.param('token') || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, process.env.JWT_KEY, function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });

  }

});

apiRoutes.get('/check', function(req, res) {
  res.json(req.decoded);
});

app.use('/api', apiRoutes);

app.post("/sessions/new", (req, res) => {
  const data = req.body.trackID;
  const queryParams = ["1", data];
  const queryString = `INSERT INTO sessions (user_id, track_id) VALUES ($1, $2) RETURNING *;
  `;
  db.query(queryString, queryParams)
    .then((result) => {
      res.json(result.rows[0]);
    })
    .catch((err) => console.log("ERRRRROR!", err));
});

const noop = () => {};

class Game {
  constructor({ id, state, maxPlayers, onGameStart = noop, onGameFinished = noop }) {
    this.state = state;
    this.maxPlayers = maxPlayers;
    this.onGameStart = onGameStart;
    this.onGameFinished = onGameFinished;
    this.players = [];
    this.id = id;
  }

  addPlayer(player) {
    if (!this.isWaiting()) {
      throw 'Cannot add player to already-running game.';
    }

    this.players.push(player);

    return this;
  }

  hasPlayer(player) {
    return this.players.includes(player);
  }

  start() {
    this.state = RacerStates.IN_PROGRESS;
    this.onGameStart(this);
  }

  isFull() {
    return this.players.length === 2;
  }

  isWaiting() {
    return this.state === RacerStates.WAITING;
  }

  isInProgress() {
    return this.state === RacerStates.IN_PROGRESS;
  }

  isFinished() {
    return this.state === RacerStates.FINISHED;
  }
}

class Player {
  constructor({ id, socketId }) {
    this.id = id;
    this.socketId = socketId;
  }
}

const createNewGame = ( { onGameStart }) => {
  return new Game({ maxPlayers: 2, onGameStart, id: uuid(), state: RacerStates.WAITING });
}

let activeGame = null;

app.get('/', (req, res) => {
  res.send('Hello').status(200);
});

io.on('connection', (socket) => {
  const player = new Player({ id: uuid(), socketId: socket.id });

  socket.on('disconnect', () => {
    if (activeGame && activeGame.hasPlayer(player)) {
      io.to(activeGame.id).emit('game.message', 'Player disconnected. Game ended.');
      activeGame = null;
    }
  });

  socket.on('game.join', () => {
    if (!activeGame) {
      activeGame = createNewGame({
        onGameStart: (game) => {
          io.to(game.id).emit('game.start');
          io.to(game.id).emit('game.message', 'We have a game!');
        }
      });
    }

    if (activeGame.isWaiting()) {
      socket.join(activeGame.id);
      socket.emit('game.message', 'Waiting for players.');

      socket.emit('game.playerId', player.id);

      activeGame.players.forEach((player) => {
        socket.emit('game.player.join', player.id);
      });

      activeGame.addPlayer(player);

      io.in(activeGame.id).emit('game.player.join', player.id);

      if (activeGame.isFull()) {
        activeGame.start();
      }
    } else {
      socket.emit('game.message', 'The game is full.');
    }
  });

  socket.on('game.player.pct', ({ id, pct }) => {
    io.to(activeGame.id).emit('game.player.setPct', { id, pct });
  });
});

server.listen(port, () => {
  console.log(`Listening on port ${port}.`);
});

app.listen(port1, () => console.log(`Server running on port ${port1}`));