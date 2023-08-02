import "reflect-metadata";
import express from "express";
import bodyParser from "body-parser";
import dotenv from 'dotenv';
import dateRoutes from "./routes/dateRoutes";
import { errorHandlerMiddleware } from "./middleware/errorHandler";
const cors = require('cors');

const app = express();
const port = 5050;
app.use(cors());
dotenv.config();
app.use(bodyParser.json());

app.post("/date");
app.use("/date", dateRoutes);
app.use(errorHandlerMiddleware);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
