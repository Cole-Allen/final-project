SET
  client_min_messages TO warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
DROP schema "public" CASCADE;

CREATE schema "public";

CREATE TABLE "users" (
  "userId" serial NOT NULL,
  "firstName" TEXT NOT NULL,
  "lastName" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "goalWeight" FLOAT NOT NULL,
  CONSTRAINT "users_pk" PRIMARY KEY ("userId")
) WITH (OIDS = FALSE);

CREATE TABLE "playlists" (
  "userId" integer NOT NULL,
  "name" TEXT NOT NULL,
  "image" TEXT,
  "spotify" TEXT,
  "playlistId" serial NOT NULL,
  CONSTRAINT "playlists_pk" PRIMARY KEY ("playlistId")
) WITH (OIDS = FALSE);

CREATE TABLE "exercises" (
  "exerciseId" serial NOT NULL,
  "userId" integer,
  "name" TEXT NOT NULL,
  "image" TEXT,
  "instructions" TEXT,
  "muscles" TEXT NOT NULL,
  CONSTRAINT "exercise_pk" PRIMARY KEY ("exerciseId")
) WITH (OIDS = FALSE);

CREATE TABLE "history" (
  "historyId" serial NOT NULL,
  "userId" integer NOT NULL,
  "date" TIMESTAMP NOT NULL DEFAULT NOW(),
  "weight" FLOAT NOT NULL,
  CONSTRAINT "history_pk" PRIMARY KEY ("historyId")
) WITH (OIDS = FALSE);

CREATE TABLE "workouts" (
  "workoutId" serial NOT NULL,
  "userId" integer NOT NULL,
  "sets" integer NOT NULL,
  "reps" integer NOT NULL,
  "dist" integer NOT NULL,
  "time" integer NOT NULL,
  "weight" FLOAT NOT NULL,
  "exerciseId" integer NOT NULL,
  CONSTRAINT "workout_pk" PRIMARY KEY ("workoutId")
) WITH (OIDS = FALSE);

CREATE TABLE "schedules" (
  "userId" integer NOT NULL,
  "scheduleId" serial NOT NULL,
  "day" TEXT NOT NULL,
  CONSTRAINT "schedule_pk" PRIMARY KEY ("scheduleId")
) WITH (OIDS = FALSE);

CREATE TABLE "schedulePlaylists" (
  "scheduleId" integer NOT NULL,
  "playlistId" integer NOT NULL,
  CONSTRAINT "schedulePlaylists_pk" PRIMARY KEY ("scheduleId", "playlistId")
) WITH (OIDS = FALSE);

CREATE TABLE "workoutPlaylists" (
  "playlistId" integer NOT NULL,
  "workoutId" integer NOT NULL,
  CONSTRAINT "workoutPlaylists_pk" PRIMARY KEY ("playlistId", "workoutId")
) WITH (OIDS = FALSE);

ALTER TABLE
  "playlists"
ADD
  CONSTRAINT "playlists_fk0" FOREIGN KEY ("userId") REFERENCES "users"("userId");

ALTER TABLE
  "exercises"
ADD
  CONSTRAINT "exercises_fk0" FOREIGN KEY ("userId") REFERENCES "users"("userId");

ALTER TABLE
  "history"
ADD
  CONSTRAINT "history_fk0" FOREIGN KEY ("userId") REFERENCES "users"("userId");

ALTER TABLE
  "workouts"
ADD
  CONSTRAINT "workouts_fk0" FOREIGN KEY ("userId") REFERENCES "users"("userId");

ALTER TABLE
  "workouts"
ADD
  CONSTRAINT "workout_fk1" FOREIGN KEY ("exerciseId") REFERENCES "exercises"("exerciseId");

ALTER TABLE
  "schedules"
ADD
  CONSTRAINT "schedules_fk0" FOREIGN KEY ("userId") REFERENCES "users"("userId");

ALTER TABLE
  "schedulePlaylists"
ADD
  CONSTRAINT "schedulePlaylists_fk0" FOREIGN KEY ("scheduleId") REFERENCES "schedules"("scheduleId");

ALTER TABLE
  "schedulePlaylists"
ADD
  CONSTRAINT "schedulePlaylists_fk1" FOREIGN KEY ("playlistId") REFERENCES "playlists"("playlistId");

ALTER TABLE
  "workoutPlaylists"
ADD
  CONSTRAINT "workoutPlaylists_fk0" FOREIGN KEY ("playlistId") REFERENCES "playlists"("playlistId");

ALTER TABLE
  "workoutPlaylists"
ADD
  CONSTRAINT "workoutPlaylists_fk1" FOREIGN KEY ("workoutId") REFERENCES "workouts"("workoutId");
