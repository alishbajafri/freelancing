import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  date: String,
  description: String,
  amount: Number,
  type: String,    // credit or debit
  status: String,  // Completed, Pending, Withdrawn
});

// Explicitly set collection to 'transactions'
export default mongoose.model("Transaction", transactionSchema, "transactions");
