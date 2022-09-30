// App config from .env
import * as dotenv from "dotenv";
dotenv.config();

import express from 'express';
import morgan from 'morgan';
import createError from 'http-errors';

import indexRoute from './src/routes/indexRoute';
import learningRoute from "./src/routes/learningRoute";
import genericErrorResponseHandler from "./src/utils/genericErrorReponseHanlder";
import version from "./src/utils/version";

// rest of the code remains same
const app = express();
const PORT = process.env.CODA_LEARNING_API_PORT;

// Better Logging
app.use(morgan('dev'));
//app.disable('etag');

// Middleware to process incoming data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// All routes
app.use('/', indexRoute);
app.use('/learning', learningRoute);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

app.use(genericErrorResponseHandler.errorHandler)

// Custom error handler are removed. A lot less dependency and everything is logged in dev mode anyway.

// Running the server
app.listen(PORT, () => {
  console.log(`⚡️[coda-learning-api]: Server is running at http://localhost:${PORT}`);
  console.log(`⚡️[coda-learning-api]: Running ${version.getBuildVersion()} version of build`);
});