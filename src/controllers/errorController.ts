import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";

const sendErrorDev = (err: AppError, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err: AppError, res: Response) => {
  // operational, that we could predict and know what the error is
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    // programming or unknown/unexpected error, so that error details is not leaked to client
    // log to console so when we read the log, we can try to figure out how to handle it
  } else {
    // log error to console
    console.error("ERROR: ", err);
    // send generic message
    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
};

function handleCastErrorDB(err: AppError) {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
}

function handleDuplicateFieldsDB(err: AppError) {
  const matchValues = err.message.match(/(["'])(\\?.)*\1/);
  let value;
  if (matchValues) {
    value = matchValues[0];
  }
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
}

function handleValidationErrorDB(err: AppError) {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
}

export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  // Default statusCode for errors that don't have statusCode
  err.statusCode = err.statusCode || 500;

  // status is 'error' if status is 500, 'fail' if status is 400
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    // since we are going to overwrite the error, we need to copy the err obj
    // so that we will not overwrite err arg(not good practice)
    let error = { ...err };
    error.message = err.message;
    error.name = err.name;
    if (err.name === "CastError") {
      error = handleCastErrorDB(error);
    }
    if (err.code === 11000) {
      error = handleDuplicateFieldsDB(error);
    }
    if (err.name === "ValidationError") {
      error = handleValidationErrorDB(error);
    }
    sendErrorProd(error, res);
  }
}
