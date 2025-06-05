import mongoose from "mongoose";

const BalanceSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true
    },
    balance: {
      type: Number,
      required: true,
    },
    remark: {
      type: String,
    },
    type: {
      type: String,
      required: true, //credit or debit
    },
    closingbalance: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Balance = mongoose.model("Balance", BalanceSchema);
export default Balance;
