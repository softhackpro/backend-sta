import mongoose from "mongoose";

const BetPasswordHistorySchema = new mongoose.Schema(
  {
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Betuser"
    },
    remark: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const BetPasswordHistory = mongoose.model("BetPasswordHistory", BetPasswordHistorySchema);
export default BetPasswordHistory;
