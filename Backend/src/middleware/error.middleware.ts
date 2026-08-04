import { Request, Response, NextFunction } from "express";
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  return res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
    data: null,
  });
};
///////////////////////////////////////////////

export const errorMiddleware = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction   ) => {

  const statusCode =    error.statusCode || 500;

  const isProduction = process.env.NODE_ENV === "production";

  // Production
  if (isProduction) {

    return res.status(statusCode).json({
      success: false,
      message:
        
      statusCode === 500? "Internal server error.": "Request failed."

    });}

  // Development

  return res.status(statusCode).json({

    success: false,
    message: error.message,
    stack: error.stack

  });};