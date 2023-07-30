import { NextFunction, Request, Response } from "express";

export const errorHandlerMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
};
