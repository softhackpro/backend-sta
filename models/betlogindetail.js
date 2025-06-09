import mongoose from "mongoose";

const BetLoginDetailSchema = new mongoose.Schema(
  {
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Betuser",
    },
    loginstatus: {
      type: String,
    },
    ipaddress: {
      type: String,
    },
    isp: {
      type: String,
    },
    city: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const BetLoginDetail = mongoose.model("BetLoginDetail", BetLoginDetailSchema);
export default BetLoginDetail;
