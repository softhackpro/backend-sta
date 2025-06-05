import Betuser from "../models/betUser.js";
import Balance from "../models/balance.js";

// Home route
const home = async (req, res) => {
  try {
    res.status(200).send("Welcome bro buddy ffg");
  } catch (error) {
    console.log(error);
  }
};

// Register route
const register = async (req, res) => {
  if (req.user.userType > req.body.userType) {
    return res
      .status(401)
      .json({ message: "You are not in upline", status: false });
  }
  try {
    const {
      username,
      userType,
      password,
      commision,
      exposureLimit,
      creditReference,
      mobileNumber,
      partnership,
      openingBalance,
    } = req.body;
    const remark = "opening balance";
    const type = "credit";
    const userExist = await Betuser.findOne({ username });
    if (userExist) {
      return res.status(400).json({ msg: "username already exist" });
    }
    const response = await Balance.create({
      username,
      balance: openingBalance,
      remark,
      type,
      closingbalance: openingBalance,
    });
    await Betuser.create({
      username,
      userType,
      password,
      commision,
      exposureLimit,
      creditReference,
      mobileNumber,
      partnership,
      openingBalance: response._id,
      parentid: req.user._id,
      parenttype: req.user.userType,
      irp: openingBalance,
    });

    res.status(201).json({
      message: "user created successfully",
      status: true,
    });
  } catch (error) {
    res.status(500).json("Internal server error");
    console.log(error);
  }
};

// Login route
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const userExist = await Betuser.findOne({ username });

    if (!userExist) {
      return res.status(400).json({ message: "Invalid Login Details" });
    }

    const user = await userExist.comparePassword(password);

    if (user) {
      res.status(200).json({
        msg: "Login successful",
        token: await userExist.generateToken(),
        virgin: userExist.virgin.toString(),
      });
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    res.status(500).json("Internal server error");
  }
};

export const updatePassword = async (req, res) => {
  const { username, oldPassword, newPassword } = req.body;

  // Input validation
  if (!username || !oldPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Username, old password and new password are required",
    });
  }

  try {
    // Find by username instead of ID
    const user = await Betuser.findOne({ username });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify old password
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    // Update password - this will trigger the pre-save hook to hash the password
    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Password update error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating password",
    });
  }
};

export const searchUser = async (req, res) => {
  try {
    const { query, limit } = req.body;

    // Validate input
    if (!query || typeof query !== "string") {
      return res.status(400).json({
        success: false,
        message: "Search query is required and must be a string",
      });
    }

    // Search by username OR mobileNumber (case insensitive)
    const users = await Betuser.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { mobileNumber: { $regex: query, $options: "i" } },
      ],
      isdeleted: false, // Exclude deleted users
    })
      .select("-password -__v")
      .populate("openingBalance")
      .populate({
        path: "parentid",
        select: "username userType",
      }).limit(limit);

    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users found matching your search",
      });
    }

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while searching",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
// Get user data
const user = async (req, res) => {
  try {
    const userData = req.user;
    res.status(200).json({ userData });
  } catch (error) {
    console.log(`Error from the user route: ${error}`);
  }
};

export { home, register, login, user };
