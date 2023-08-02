import express from "express";
import { getDates, sendData } from "../controllers/dateControllers";
import { dateValidation } from "../middleware/dateValidation";
import { rangeValidation } from "../middleware/rangeValidation";

const router = express.Router();

router.get("/", getDates);
router.post("/", dateValidation, rangeValidation, sendData);

export default router;
