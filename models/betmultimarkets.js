import mongoose from "mongoose";

const BetmultimarketsSchema = new mongoose.Schema(
  {
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Betuser"
    },
    title: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    f: {
      type: Boolean,
    },
    s: {
      type: Boolean,
    },
    bm: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

const Betmultimarkets = mongoose.model("Betmultimarkets", BetmultimarketsSchema);
export default Betmultimarkets;
