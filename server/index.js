require('dotenv/config');
const pg = require('pg');
const argon2 = require('argon2');
const express = require('express');
const jwt = require('jsonwebtoken');
const ClientError = require('./client-error');
const errorMiddleware = require('./error-middleware');
const staticMiddleware = require('./static-middleware');
const querystring = require('querystring');
const cors = require('cors');
const axios = require('axios');

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const redirectUri = 'http://localhost:3000/#settings';

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const app = express();

app.use(staticMiddleware);

app.use(errorMiddleware);

app.use(express.json());
app.use(cors());

app.use('/api/:usertoken', function (req, res, next) {
  const payload = jwt.decode(req.params.usertoken);
  req.payload = (payload);
  next();
});

app.use('/api/spotify', function (req, res, next) {

  next();
});

const generateRandomString = function (length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const stateKey = 'spotify_auth_state';

app.post('/api/auth/sign-up', (req, res, next) => {
  const { email, firstName, lastName, password } = req.body;
  if (!password || !firstName || !lastName || !email) {
    throw new ClientError(400, 'All fields are required');
  }

  const sql = `
  INSERT INTO "users" ("email", "firstName", "lastName", "password")
  VALUES ($1, $2, $3, $4)
  returning "firstName";
  `;

  argon2
    .hash(password)
    .then(pass => {
      const params = [email, firstName, lastName, pass];
      return db.query(sql, params)
        .then(result => {
          res.status(201).json({ result });
        });

    }).catch(err => next(err));
});

app.post('/api/auth/sign-in', (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ClientError(401, 'Invalid Login');
  }

  const sql = `
  SELECT
    "userId",
    "password",
    "firstName"
  FROM
    "users"
  WHERE
    "email" = $1;
  `;

  const params = [email];
  db.query(sql, params)
    .then(result => {
      const [user] = result.rows;
      if (!user) {
        throw new ClientError(401, 'Invalid Login');
      }
      const { userId, password: hashedPassword, firstName } = user;
      return argon2
        .verify(hashedPassword, password)
        .then(isMatching => {
          if (!isMatching) {
            throw new ClientError(401, 'Invalid Login');
          }
          const payload = { userId, email, firstName };
          const token = jwt.sign(payload, process.env.TOKEN_SECRET);
          res.json({ token, user: payload });
        });
    })
    .catch(err => next(err));
});

app.get('/api/:userid/weight', (req, res, next) => {
  const sql = `
  SELECT *
  FROM "history"
  WHERE "userId" = $1
  ORDER BY "date" DESC;
  `;

  const params = [req.payload.userId];

  db.query(sql, params)
    .then(result => {
      res.status(201).json(result.rows);
    });

});

app.post('/api/:userid/weight', (req, res, next) => {
  const { weight, date } = req.body;
  const sql = `
    INSERT INTO
      "history" ("weight","date", "userId")
    VALUES
      ($1, $2, $3)
    RETURNING *;
  `;

  const params = [weight, date, req.payload.userId];

  db.query(sql, params)
    .then(result => {
      res.status(200).json({ completed: 'yay' });
    }
    );
});

app.put('/api/weight/:id', (req, res, next) => {

  const { weight, date } = req.body;

  const sql = `
    UPDATE "history"
    SET
      "weight" = $1,
      "date" = $2
    WHERE
      "historyId" = $3
  `;
  const params = [weight, date, req.params.id];

  db.query(sql, params)
    .then(result => res.status(333));

});

app.delete('/api/weight/:id', (req, res, next) => {
  const sql = `
  DELETE from "history"
  WHERE "historyId" = $1;
  `;

  const params = [req.params.id];

  db.query(sql, params)
    .then(result => res.status(200).json({ test: 'test' }));
});

app.get('/api/:userid/routines', (req, res, next) => {
  const sql = `
    SELECT *
    FROM "playlists"
    WHERE "userId" = $1
    ORDER BY "playlistId";
  `;

  const params = [req.payload.userId];

  db.query(sql, params)
    .then(result => res.status(201).json(result.rows))
    .catch(err => console.error(err));
});

app.put('/api/:userid/routines', (req, res, next) => {

  const sql = `
    INSERT into "playlists" ("userId", "name")
    VALUES ($1, $2)
    RETURNING *;
  `;

  const params = [req.params.userid, 'New Routine'];

  db.query(sql, params)
    .then(result => res.status(201).json(result.rows));

});

app.get('/api/routine/:id', (req, res, next) => {
  const sql = `
    SELECT *
    FROM "playlists"
    WHERE "playlistId" = $1;
  `;

  const params = [req.params.id];

  db.query(sql, params)
    .then(result => res.status(200).json(result.rows))
    .catch(e => console.error('test', e));
});

app.put('/api/routine/:id', (req, res, next) => {
  const { nameValue, id } = req.body;
  const sql = `
    UPDATE "playlists"
    SET "name" = $1
    WHERE "playlistId" = $2;
  `;
  const params = [nameValue, id];

  db.query(sql, params)
    .then(result => res.status(200));
});

/* ````````````````````````````````SPOTIFY```````````````````````````````````````` */
// get url to spotify authpage that user will be redirected to
// creating url through server keeps secret and client id safe
app.get('/api/spotify/login', cors(), (req, res, next) => {
  const state = generateRandomString(16);
  res.cookie(stateKey, state);
  const scope = 'user-read-private user-read-email playlist-read-private';
  res.status(201).json({
    url: ('https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: clientId,
        scope: scope,
        redirect_uri: redirectUri,
        state: state,
        show_dialog: true
      }))
  });
});

// take code given after authorization to generate tokens
app.post('/api/spotify/code', (req, res, next) => {
  const body = {
    grant_type: 'authorization_code',
    code: req.body.code,
    redirect_uri: redirectUri,
    client_id: clientId,
    client_secret: clientSecret
  };
  const headers = {
    headers: {
      method: 'POST',
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    Authorizartion: 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64')
  };

  axios.post(
    'https://accounts.spotify.com/api/token',
    querystring.stringify(body),
    headers)
    .then(response => res.send(response.data))
    .catch(err => console.error('SpotifyCodeErr', err));
});

// // put access_token and refresh_token into user db
// app.post('/api/:usertoken/spotify', (req, res, next) => {
//   const sql = `
//     UPDATE "users"
//     SET "spotifyAT" = $1,
//     "spotifyRT" = $2
//     WHERE "userId" = $3;
//   `;
//   const params = [req.body.data.access_token, req.body.data.refresh_token, req.payload.userId];

//   db.query(sql, params)
//     .then(result => res.status(200).json({ updates: 'db' }));
// });

// Use tokens to get access to users information
app.post('/api/:usertoken/spotify/request', (req, res, next) => {
  axios.get(
    'https://api.spotify.com/v1/me', {
      headers: {
        Authorization: 'Bearer ' + req.body.token
      }
    }
  )
    .then(result => {
      // console.log(result.data);
      res.json(result.data);
    })
    .catch(err => console.error('this error', err));

});

// unlink spotify from db (pointless rn)
app.get('/api/:usertoken/spotify/unlink', (req, res, next) => {
  const sql = `
    UPDATE "users"
    SET "spotifyAT" = $1,
    "spotifyRT" = $2
    WHERE "userId" = $3;
  `;

  const params = ['', '', req.payload.userId];

  db.query(sql, params)
    .then(res.status(200).json({ del: 'del' }));
});

// use tokens and user id to access their created playlists
app.post('/api/:usertoken/spotify/get/playlist', (req, res, next) => {
  const { userid, token } = req.body;
  axios.get(
    `https://api.spotify.com/v1/users/${userid}/playlists`, {
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    }
  )
    .then(result => {
      res.json(result.data);
    })
    .catch(err => console.error('err', err));
});

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});
