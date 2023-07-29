import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import db from "./db/dbConnection";

const app = express();
const port = 5050;

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

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
