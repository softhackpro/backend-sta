import Balance from "../models/balance.js";

export const accountStmt = async (req, res) => {
  try {
    const username = req.user.username;
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default 10 items per page
    const skip = (page - 1) * limit;
    const { startDate, endDate } = req.query;
    const query = { username };
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      // Include the entire end date by setting time to 23:59:59
      end.setHours(23, 59, 59, 999);

      query.createdAt = {
        $gte: start,
        $lte: end,
      };
    } else if (startDate) {
      // If only start date is provided
      const start = new Date(startDate);
      query.createdAt = { $gte: start };
    } else if (endDate) {
      // If only end date is provided
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      query.createdAt = { $lte: end };
    }

    // Get total count of documents for pagination info
    const total = await Balance.countDocuments(query);

    // Find documents with pagination
    const transactions = await Balance.find(query)
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip(skip)
      .limit(limit);

    if (!transactions || transactions.length === 0) {
      return res.status(404).json({
        message: "No transactions found",
        status: false,
      });
    }

    // Process each transaction in the array
    const processedTransactions = transactions.map((transaction) => ({
      date: transaction.createdAt,
      deposit: transaction.type === "credit" ? transaction.balance : 0,
      withdraw: transaction.type === "debit" ? transaction.amount : 0,
      balance: transaction.closingbalance, // Make sure this matches your schema
      remark: transaction.remark,
      from: "master exchange",
    }));

    res.status(200).json({
      message: "Account statement fetched successfully",
      status: true,
      data: processedTransactions, // Send the array of processed transactions
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page * limit < total,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Account statement error:", error);
    res.status(500).json({
      message: "Error fetching account statement",
      status: false,
    });
  }
};
