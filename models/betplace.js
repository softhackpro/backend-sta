import mongoose from "mongoose";

const BetplaceSchema = new mongoose.Schema(
  {
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    mid: {
      type: Number,
      required: true,
    },
    rate: {
      type: Number,
    },
    sid: {
      type: Number,
      required: true, //credit or debit
    },
    backorlay: {
      type: String,
      required: true,
    },
    gmid: {
      type: Number,
      required: true,
    },
    money: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true, //matchodds bookmaker bla bla
    },
    matchname: {
      type: String,
      required: true,
    },
    tournament: {
      type: String,
      required: true,
    },
    winamount: {
      type: Number,
      required: true, 
    },
    lossamount: {
      type: Number,
      required: true,
    },
    locationInfo: {
      country: {
        type: String,
      },
      region: {
        type: String,
      },
      city: {
        type: String,
      },
      isp: {
        type: String,
      },
    },
    status: {
      type: String,
      default: "pending",
    },
    selection: {
      type: String,
      required: true
    },
  },
  {
    timestamps: true,
  }
);

const Betplace = mongoose.model("Betplace", BetplaceSchema);
export default Betplace;
