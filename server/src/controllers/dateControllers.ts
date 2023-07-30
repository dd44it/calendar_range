import { Request, Response } from "express";
import db from "../db/dbConnection";
import { DateRow } from "../utils/dateHelpers";

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

    const insertQuery = "INSERT INTO date (date_start, date_end) VALUES (?, ?)";
    await db.promise().query(insertQuery, [date_start, date_end]);
    
    const [rows] = await db.promise().query('SELECT * FROM date');
    res.json({ message: "Data inserted successfully", result: rows, inserted_date: [date_start, date_end] });
  } catch (err) {
    console.error("Error executing query:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
