import express from "express";
import bodyParser from "body-parser";
import dotenv from 'dotenv';
const cors = require('cors');
import dateRoutes from "./routes/dateRoutes";
import { errorHandlerMiddleware } from "./middleware/errorHandler";
import { dateValidation } from "./middleware/dateValidation";
import { rangeValidation } from "./middleware/rangeValidation";

const app = express();
const port = 5050;
app.use(cors());
dotenv.config();
app.use(bodyParser.json());

app.post("/date", dateValidation, rangeValidation);
app.use("/date", dateRoutes);
app.use(errorHandlerMiddleware);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
