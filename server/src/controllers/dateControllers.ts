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

    const startDate = new Date(date_start);
    const endDate = new Date(date_end);
    if (endDate < startDate) {
      return res.status(200).json({ error: "date_end cannot be smaller than date_start." });
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