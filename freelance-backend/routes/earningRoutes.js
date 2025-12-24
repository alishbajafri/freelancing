import express from "express";
import Earning from "../models/Earning.js";

const router = express.Router();

// GET earnings
router.get("/", async (req, res) => {
  try {
    // Since you have one document with months array
    const earningsDoc = await Earning.findOne(); 
    res.json(earningsDoc?.months || []); // send only the months array
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching earnings", error });
  }
});

export default router;
