import express from "express";
import Transaction from "../models/Transaction.js";

const router = express.Router();

// GET all transactions
router.get("/", async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Error fetching transactions", error });
  }
});

// GET single transaction by id (optional)
router.get("/:id", async (req, res) => {
  try {
    const transaction = await Transaction.findOne({ id: req.params.id });
    if (!transaction)
      return res.status(404).json({ message: "Transaction not found" });
    res.json(transaction);
  } catch (error) {
    console.error("Error fetching transaction:", error);
    res.status(500).json({ message: "Error fetching transaction", error });
  }
});

export default router;
