import express from "express";
import bodyParser from "body-parser";
import dateRoutes from "./routes/dateRoutes";
import dotenv from 'dotenv';
const cors = require('cors');

const app = express();
const port = 5050;
app.use(cors());
dotenv.config();

app.use(bodyParser.json());

app.use("/date", dateRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
