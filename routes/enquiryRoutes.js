import express from "express";
import { sendEnquiry } from "../controllers/enquiryController.js";

const router = express.Router();

router.post("/enquiry", sendEnquiry);

export default router;
