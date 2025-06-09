import Betuser from "../models/betUser.js";
import Balance from "../models/balance.js";
import BetPasswordHistory from "../models/betpasswordhistory.js";
import BetLoginDetail from "../models/betlogindetail.js";
import { getLocationInfo } from "../utils/locationUtils.js";
// Home route
export const home = async (req, res) => {
  try {
    res.status(200).send("Welcome bro buddy ffg");
  } catch (error) {
    console.log(error);
  }
};

// Register route
export const register = async (req, res) => {
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
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;
    const userExist = await Betuser.findOne({ username });

    let locationInfo = await getLocationInfo(ip);

    if (!userExist) {
      return res.status(400).json({ message: "Invalid Login Details" });
    }

    const endpoint = req.originalUrl;
    if (endpoint.includes("admin-login") && userExist.userType > 5) {
      return res.status(403).json({ status: false, message: "Access denied: not an admin user" });
    }

    const user = await userExist.comparePassword(password);

    if (user) {
      await BetLoginDetail.create({
        userid: user._id,
        loginstatus: "Login Successful",
        isp: locationInfo.isp,
        city: locationInfo.city,
      });

      return res.status(200).json({
        msg: "Login successful",
        token: await userExist.generateToken(),
        virgin: userExist.virgin,
      });
    } else {
      return res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    console.error(error); // Add this for debugging
    return res.status(500).json("Internal server error");
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

    const remark = req.originalUrl.includes("admin-update")
      ? "password changed by master"
      : "password changed by self";

    await BetPasswordHistory.create({
      userid: user._id,
      remark: remark,
    });

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
      })
      .limit(limit);

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
export const user = async (req, res) => {
  try {
    const userData = req.user;
    res.status(200).json({ userData });
  } catch (error) {
    console.log(`Error from the user route: ${error}`);
  }
};

export const passwordhistory = async (req, res) => {
  try {
    const id = req.user._id;
    
    // Pagination parameters (default: page 1, limit 10)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get total count for pagination info
    const total = await BetPasswordHistory.countDocuments({ userid: id });

    const result = await BetPasswordHistory.find({ userid: id })
      .sort({ createdAt: -1 })
      .select("-__v")
      .skip(skip)
      .limit(limit);

    if (!result || result.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No password history found for this user",
      });
    }

    res.status(200).json({ 
      status: true, 
      data: result,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page * limit < total,
        hasPreviousPage: page > 1
      }
    });
  } catch (error) {
    console.error("Password history error:", error);
    return res.status(500).json({
      status: false,
      message: "An error occurred while fetching password history",
    });
  }
};

export const loginHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    // Validate user ID exists in request
    if (!userId) {
      return res.status(400).json({
        status: false,
        message: "User authentication required"
      });
    }

    // Pagination parameters (default: page 1, limit 10)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get total count for pagination info
    const total = await BetLoginDetail.countDocuments({ userid: userId });

    // Fetch login history with sorting (newest first) and field selection
    const history = await BetLoginDetail.find({ userid: userId })
      .sort({ loginTime: -1 })  // Sort by most recent login
      .select('-__v')           // Exclude version key
      .skip(skip)
      .limit(limit);

    if (!history || history.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No login history found for this user"
      });
    }

    return res.status(200).json({
      status: true,
      data: history,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page * limit < total,
        hasPreviousPage: page > 1
      }
    });

  } catch (error) {
    console.error("Login history error:", error);
    return res.status(500).json({
      status: false,
      message: "An error occurred while fetching login history",
    });
  }
};
