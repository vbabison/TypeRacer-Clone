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

let Util = require('./services/UtilityService');

app.get("/api/creators", (req, res) => {
  const creators = [
    { id: 1, firstName: "Nick", lastName: "Maniutin" },
    { id: 2, firstName: "Bobby", lastName: "Brown" },
    { id: 3, firstName: "Sergey", lastName: "Barchshevskiy" },
  ];

  res.json(creators);
});

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




//send drum values to the db
app.post("/session/drums", (req, res) => {
  const data = req.body.newSessionID;
  // res.json({});
  const queryParams = [data];
  const queryString = `INSERT INTO drum_sequence 
  (session_id, drums_kick, drums_snare, drums_ho, drums_hc) 
  VALUES ($1, 
  ARRAY[]::integer[], 
  ARRAY[]::integer[], 
  ARRAY[]::integer[], 
  ARRAY[]::integer[]) RETURNING *;`;
  db.query(queryString, queryParams)
    .then((result) => {
      res.json(result.rows[0]);
    })
    .catch((err) => console.log("ERRRRROR!", err));
});

app.post("/session/:sessionID/drums", (req, res) => {
  console.log("PARAMS: ", req.params);
  const data = req.body.drumValues;
  res.json({});
  const queryParams = [
    "1",
    data.drums_kick,
    data.drums_snare,
    data.drums_ho,
    data.drums_hc,
  ];
  const queryString = `INSERT INTO drum_sequence (session_id, drums_kick, drums_snare, drums_ho, drums_hc)
  VALUES ($1, $2, $3, $4, $5) RETURNING *;`;
  db.query(queryString, queryParams)
    .then((res) => console.log("DONE!", res.rows))
    .catch((err) => console.log("ERRRRROR!", err));
});

// send bass values to the db
app.post("/session/bass", (req, res) => {
  const data = req.body.newSessionID;
  // res.json({});
  const queryParams = [data];
  const queryString = `INSERT INTO bass_sequence
  (session_id, bass_c1, bass_d1, bass_e1, bass_f1, bass_g1, bass_a1, bass_b1, bass_c2)
  VALUES ($1,
  ARRAY[]::integer[],
  ARRAY[]::integer[],
  ARRAY[]::integer[],
  ARRAY[]::integer[],
  ARRAY[]::integer[],
  ARRAY[]::integer[],
  ARRAY[]::integer[],
  ARRAY[]::integer[]) RETURNING *;`;
  db.query(queryString, queryParams)
    .then((result) => {
      res.json(result.rows[0]);
    })
    .catch((err) => console.log("ERRRRROR!", err));
});
// app.post("/session/bass", (req, res) => {
//   const data = req.body.bassValues;
//   res.json({});
//   const queryParams = [
//     "1",
//     data.bass_c2,
//     data.bass_b1,
//     data.bass_a1,
//     data.bass_g1,
//     data.bass_f1,
//     data.bass_e1,
//     data.bass_d1,
//     data.bass_c1,
//   ];
//   const queryString = `INSERT INTO bass_sequence (session_id, bass_c1, bass_d1, bass_e1, bass_f1, bass_g1, bass_a1, bass_b1, bass_c2)
//   VALUES ($1, $9, $8, $7, $6, $5, $4, $3, $2) RETURNING *;`;
//   db.query(queryString, queryParams)
//     .then((res) => console.log("DONE!", res.rows))
//     .catch((err) => console.log("ERRRRROR!", err));
// });

//send synth values to the db
app.post("/session/synth", (req, res) => {
  const data = req.body.newSessionID;
  const queryParams = [data];
  const queryString = `INSERT INTO synth_sequence
  (session_id, synth_c3, synth_d3, synth_e3, synth_f3, synth_g3, synth_a3, synth_b3, synth_c4)
  VALUES ($1,
  ARRAY[]::integer[],
  ARRAY[]::integer[],
  ARRAY[]::integer[],
  ARRAY[]::integer[],
  ARRAY[]::integer[],
  ARRAY[]::integer[],
  ARRAY[]::integer[],
  ARRAY[]::integer[]) RETURNING *;`;
  db.query(queryString, queryParams)
    .then((result) => {
      res.json(result.rows[0]);
    })
    .catch((err) => console.log("ERRRRROR!", err));
});
// app.post("/session/synth", (req, res) => {
//   const data = req.body.synthValues;
//   const queryParams = [
//     "1",
//     data.synth_c4,
//     data.synth_b3,
//     data.synth_a3,
//     data.synth_g3,
//     data.synth_f3,
//     data.synth_e3,
//     data.synth_d3,
//     data.synth_c3,
//   ];
//   const queryString = `INSERT INTO synth_sequence (session_id, synth_c3, synth_d3, synth_e3, synth_f3, synth_g3, synth_a3, synth_b3, synth_c4)
//   VALUES ($1, $9, $8, $7, $6, $5, $4, $3, $2) RETURNING *;`;
//   db.query(queryString, queryParams)
//     .then((result) => res.json(result.rows[0]))
//     .catch((err) => console.log("ERRRRROR!", err));
// });

app.get("/api/tracks", (req, res) => {
  const queryString = `SELECT * FROM tracks;
  `;
  db.query(queryString)
    .then((result) => res.json(result.rows))
    .catch((err) => console.log("ERRRRROR!", err));
});

app.post("/tracks/new", (req, res) => {
  const data = req.body.createNewTrack;
  const queryParams = ["1", data.title, data.category, data.description];
  const queryString = `INSERT INTO tracks (user_id, title, category, description)
  VALUES ($1, $2, $3, $4) RETURNING *;`;
  db.query(queryString, queryParams)
    .then((result) => res.json(result.rows[0]))
    .catch((err) => console.log("ERRRRROR!", err));
});

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

app.listen(port, () => `Server running on port ${port}`);