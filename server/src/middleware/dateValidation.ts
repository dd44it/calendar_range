import { NextFunction, Request, Response } from "express";
import { isValidDateString } from "../utils/dateHelpers";

export const dateValidation = (req: Request, res: Response, next: NextFunction) => {
  const { date_start, date_end } = req.body;

  if (!date_start || !date_end) {
    return res.status(200).json({ error: "Both date_start and date_end are required." });
  }

  if (!isValidDateString(date_start) || !isValidDateString(date_end)) {
    return res.status(200).json({ error: "You sent incorrect dates. Please try again." });
  }

  const startDate = new Date(date_start);
  const endDate = new Date(date_end);
  if (endDate < startDate) {
    return res.status(200).json({ error: "date_end cannot be smaller than date_start." });
  }

  next();
};
