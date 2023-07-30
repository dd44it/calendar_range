import express from "express";
import { getDates, sendData } from "../controllers/dateControllers";

const router = express.Router();

router.get("/", getDates);
router.post("/", sendData);

export default router;
