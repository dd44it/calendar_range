import { Request, Response } from "express";
import db from "../db/dbConnection";

interface DateRow {
  date_start: string;
  date_end: string;
}

export const getDates = async (req: Request, res: Response) => {
  try{
    const [rows, fields] = await db.promise().query("SELECT * FROM date");
    const data: DateRow[] = rows as DateRow[];
    res.json(data);
  }
  catch(err) {
    console.error("Error executing query:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const sendData = async (req: Request, res: Response) => {
  try {
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

    const [rowsBefore] = await db.promise().query('SELECT * FROM date');
    const getDatesRange = extractIndividualDates(rowsBefore);
    const userDateRange = extractIndividualDates([{date_start, date_end}]);

    const checkRange = isCleanDates(getDatesRange, userDateRange);
    if(checkRange){
      return res.status(200).json({ error: "You have selected an invalid range. There are already reserved dates within your chosen range. We apologize for the inconvenience; please select a different range." });
    }

    const insertQuery = "INSERT INTO date (date_start, date_end) VALUES (?, ?)";
    await db.promise().query(insertQuery, [date_start, date_end]);
    
    const [rows] = await db.promise().query('SELECT * FROM date');
    res.json({ message: "Data inserted successfully", result: rows, inserted_date: [date_start, date_end] });
  } catch (err) {
    console.error("Error executing query:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const isValidDateString = (dateString: string): boolean => {
  const timestamp = Date.parse(dateString);
  return !isNaN(timestamp);
};

const extractIndividualDates = (dateRanges: DateRow[]): Date[] => {
  const step = 1;
  const individualDates: Date[] = [];
  dateRanges.forEach((dateRange) => {
    const startDate = new Date(dateRange.date_start);
    const endDate = new Date(dateRange.date_end);

    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      individualDates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + step);
    }
  });
  return individualDates;
}

const formatDateToStringForDB = (date: Date): string => {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
}


const isCleanDates = (getDatesRangeDB: Date[], rangeUser: Date[]): boolean => {
  let flagValidation = false;
  const formatBookedDate = getDatesRangeDB.map(date => formatDateToStringForDB(date));
  const formatUserRange = rangeUser.map(date => formatDateToStringForDB(date));
  for(let date of formatUserRange){ 
    if(formatBookedDate.includes(date)){
      flagValidation = true;
      break;
    }
  }
  return flagValidation;
}