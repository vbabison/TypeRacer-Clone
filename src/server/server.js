const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
require("dotenv").config();

const cors = require("cors");

let jwt = require('jsonwebtoken');

const jsonParser = bodyParser.json();
const app = express();
app.use(cors());
app.use(jsonParser);

let dbParams = {};
if (process.env.DATABASE_URL) {
  dbParams.connectionString = process.env.DATABASE_URL;
} else {
  dbParams = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    api: process.env.DB_GMAPS,
  };
}

const db = new Pool(dbParams);
db.connect();

let Util = require('../services/UtilityService');

const port = 5000;

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

app.listen(port, () => console.log(`Server running on port ${port}`));