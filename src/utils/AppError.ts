class AppError extends Error {
  statusCode: number;
  message: string;
  status: string;
  isOperational: boolean;
  path?: string;
  value?: string;
  code?: number;
  errors: object;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";

    // error from operating
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
