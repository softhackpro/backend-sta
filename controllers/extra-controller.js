import Betmultimarkets from "../models/betmultimarkets.js";

export const savemultimarkets = async (req, res) => {
    try {
        const userid = req.user._id;
        const { title, url, f, s, bm } = req.body;

        // Validate required fields
        if (!title || !url) {
            return res.status(400).json({
                success: false,
                error: "fields (title, url) are required"
            });
        }

        // Create new multi-market bet
        const newMultiMarket = new Betmultimarkets({
            userid,
            title,
            url,
            f,
            s,
            bm,
        });

        // Save to database
        const savedMarket = await newMultiMarket.save();

        res.status(201).json({
            success: true,
            message: "Multi-market bet saved successfully",
            data: {
                id: savedMarket._id,
                title: savedMarket.title,
                url: savedMarket.url,
                createdAt: savedMarket.createdAt
            }
        });

    } catch (error) {
        console.error("Error in savemultimarkets:", error);

        res.status(500).json({ 
            success: false,
            error: "Internal server error",
            message: error.message 
        });
    }
};

export const getmultimarkets = async (req, res) => {
    try {
        const id = req.user._id;
        
        // Get pagination parameters from query (default: page=1, limit=10)
        const { page = 1, limit = 10, sort = '-createdAt' } = req.query;
        const skip = (page - 1) * limit;

        // Find all multi-markets for the user with pagination
        const results = await Betmultimarkets.find({ userid: id })
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit))
            .lean(); // Convert to plain JavaScript objects

        // Count total documents for pagination info
        const total = await Betmultimarkets.countDocuments({ userid: id });

        // Format the response data
        const formattedResults = results.map(market => ({
            id: market._id,
            title: market.title,
            url: market.url,
            f: market.f,
            s: market.s,
            bm: market.bm,
        }));

        res.json({
            success: true,
            data: formattedResults,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: parseInt(limit)
            }
        });

    } catch (error) {
        console.error("Error in getmultimarkets:", error);
        
        res.status(500).json({ 
            success: false,
            error: "Internal server error",
            message: error.message 
        });
    }
};