import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Define sub-schema for rolling commissions
const rollingCommissionSchema = new mongoose.Schema(
  {
    fancy: { type: Number, default: 0 },
    matka: { type: Number, default: 0 },
    casino: { type: Number, default: 0 },
    sportbook: { type: Number, default: 0 },
    virtualSports: { type: Number, default: 0 },
    binary: { type: Number, default: 0 },
    bookmaker: { type: Number, default: 0 },
  },
  { _id: false } // prevents _id from being created in subdocument
);

const betuserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    userType: {
      type: Number,
      required: true, //0 for admin, 1 for mini and so on ....
    },
    parentid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Betuser",
      required: true,
    },
    parenttype: {
      type: Number,
      required: true,
    },
    commision: {
      type: Number,
    },
    openingBalance: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Balance",
      required: true,
    },
    exposureLimit: {
      type: Number,
    },
    creditReference: {
      type: Number,
    },
    mobileNumber: {
      type: String,
    },
    partnership: {
      type: Number,
    },
    password: {
      type: String,
      required: true,
    },
    rollingCommison: {
      type: rollingCommissionSchema,
      default: () => ({}),
    },
    agentRollingCommison: {
      type: rollingCommissionSchema,
      default: () => ({}),
    },
    isdeleted: {
      type: Boolean,
      default: false,
    },
    blocked: {
      type: mongoose.Schema.Types.ObjectId,
    },
    irp: {
      type: Number,
      default: 0,
    },
    virgin: {
      type: Boolean,
      default: true
    },
    
  },
  {
    timestamps: true,
  }
);

// Hash password before save
betuserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const saltRound = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, saltRound);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
betuserSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

// Generate JWT token method
betuserSchema.methods.generateToken = function () {
  try {
    return jwt.sign(
      {
        mobileNumber: this.mobileNumber.toString(),
        username: this.username,
        userType: this.userType,
        _id: this._id,
      },
      process.env.TOKEN_SECRET_KEY,
      { expiresIn: "365d" }
    );
  } catch (error) {
    console.error(error);
  }
};

const Betuser = mongoose.model("Betuser", betuserSchema);
export default Betuser;
