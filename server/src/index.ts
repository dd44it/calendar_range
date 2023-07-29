import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import db from "./db/dbConnection";
import dotenv from 'dotenv';

const app = express();
const port = 5050;
dotenv.config();

app.use(bodyParser.json());

app.get('/date', async (req: Request, res: Response) => {
  try {
    const [rows, fields] = await db.promise().query('SELECT * FROM date');
    res.json(rows);
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

app.post('/date', async (req: Request, res: Response) => {
  try{
    const { date_start, date_end } = req.body;
    if(!date_start || !date_end) {
      return res.status(400).json({ error: "All data are mandatory" });
    }
    const startDate = new Date(date_start);
    const endDate = new Date(date_end);
    if (endDate < startDate) {
      return res.status(400).json({ error: "date_end cannot be smaller than date_start." });
    }

    //  !TODO: add conditional date_start and date_end, this dates shouldn't be in db

    const insertQuery = "INSERT INTO date (date_start, date_end) VALUES (?, ?)";
    await db.promise().query(insertQuery, [date_start, date_end]);

    res.json({ message: "Data inserted successfully" });

  }
  catch(err){
    console.error('Error inserting:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
