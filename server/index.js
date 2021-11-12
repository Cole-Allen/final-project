require('dotenv/config');
const pg = require('pg');
const argon2 = require('argon2');
const express = require('express');
const jwt = require('jsonwebtoken');
const ClientError = require('./client-error');
const errorMiddleware = require('./error-middleware');
const staticMiddleware = require('./static-middleware');

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

app.use('/api/:usertoken', function (req, res, next) {
  const payload = jwt.decode(req.params.usertoken);
  req.payload = (payload);
  next();
});

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
    WHERE "userId" = $1;
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

  const params = [req.params.userid, 'New Playlist'];

  db.query(sql, params)
    .then(result => res.status(201).json(result.rows));

});

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});
