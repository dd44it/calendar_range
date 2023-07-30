import { NextFunction, Request, Response } from "express";
import db  from "../db/dbConnection";
import { extractIndividualDates, isCleanDates } from "../utils/dateHelpers";

export const rangeValidation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const duplicateCheckQuery = "SELECT COUNT(*) AS count FROM date WHERE date_start = ? AND date_end = ?";
    const [duplicateRows] = await db.promise().query(duplicateCheckQuery, [req.body.date_start, req.body.date_end]);

    if (duplicateRows[0].count > 0) {
      return res.status(200).json({ error: "Duplicate entry. The provided date range already exists in the database." });
    }

    const [rowsBefore] = await db.promise().query("SELECT * FROM date");
    const getDatesRange = extractIndividualDates(rowsBefore);
    const userDateRange = extractIndividualDates([{ date_start: req.body.date_start, date_end: req.body.date_end }]);

    if (isCleanDates(getDatesRange, userDateRange)) {
      return res.status(200).json({
        error:
          "You have selected an invalid range. There are already reserved dates within your chosen range. We apologize for the inconvenience; please select a different range.",
      });
    }

    next();
  } catch (err) {
    console.error("Error executing query:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
