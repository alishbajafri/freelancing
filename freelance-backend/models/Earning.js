import mongoose from "mongoose";

const MonthSchema = new mongoose.Schema({
  month: String,
  amount: Number,
  id: String,
});

const EarningSchema = new mongoose.Schema({
  months: [MonthSchema]
});

// Explicitly set collection to 'earnings'
export default mongoose.model("Earning", EarningSchema, "earnings");
