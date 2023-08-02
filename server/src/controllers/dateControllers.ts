import { Request, Response } from "express";
import { AppDataSource } from "../db/dbConnection";
import { Date } from "../entities/date.entity";

export const getDates = async (req: Request, res: Response) => {
  try {
    const dateRepository = AppDataSource.getRepository(Date);
    const dates = await dateRepository.find();
    res.json(dates);
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const sendData = async (req: Request, res: Response) => {
  try {
    const { date_start, date_end } = req.body;
    const dateRepository = AppDataSource.getRepository(Date);
    const dateEntity = new Date();
    dateEntity.date_start = date_start;
    dateEntity.date_end = date_end;

    await dateRepository.save(dateEntity);

    const dates = await dateRepository.find();
    res.json({ message: "Data inserted successfully", result: dates, inserted_date: [date_start, date_end] });
  } catch (err) {
    console.error("Error inserting data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
