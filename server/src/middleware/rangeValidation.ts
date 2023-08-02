import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../db/dbConnection";
import { extractIndividualDates, isCleanDates } from "../utils/dateHelpers";
import { Date } from "../entities/date.entity";

export const rangeValidation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dateRepository = AppDataSource.getRepository(Date);
    const duplicateCount = await dateRepository.count({
      where: {
        date_start: req.body.date_start,
        date_end: req.body.date_end,
      },
    });

    if (duplicateCount > 0) {
      return res.status(200).json({ error: "Duplicate entry. The provided date range already exists in the database." });
    }

    const datesBefore = await dateRepository.find();
    const getDatesRange = extractIndividualDates(datesBefore);
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