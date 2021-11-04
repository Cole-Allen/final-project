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

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});
