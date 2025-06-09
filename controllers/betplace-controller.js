import Betplace from "../models/betplace.js";
import Betuser from "../models/betUser.js";
import { getLocationInfo } from "../utils/locationUtils.js";


export const placeBet = async (req, res) => {
  try {
    if (req.user.userType !== 6){
      return res.status(401).json({message: "user not found", status: false})
    }
    const userid = req.user._id;
    const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;
    let locationInfo = await getLocationInfo(ip);

    const { mid, rate, sid, backorlay, gmid, money, matchname, tournament, type, selectedbetname } = req.body;

    let winamount = 0;
    let lossamount = 0;

    // Calculate win/loss amount based on bet type and direction
    if (type === "bookmaker" && backorlay === "back") {
      winamount = (money * rate) / 100;
      lossamount = money;
    } else if (type === "bookmaker" && backorlay === "lay") {
      lossamount = (money * rate) / 100;
      winamount = money;
    } else if (
      ["match_odds", "moneyline"].includes(type) &&
      backorlay === "back"
    ) {
      winamount = money * rate;
      lossamount = money;
    } else if (
      ["match_odds", "moneyline"].includes(type) &&
      backorlay === "lay"
    ) {
      lossamount = money * rate;
      winamount = money;
    } else if (type === "fancy" && backorlay === "back") {
      winamount = (money * rate) / 100;
      lossamount = money;
    } else if (type === "toss" && backorlay === "back") {
      winamount = (money * rate) / 100;
      lossamount = money;
    } else if (type === "toss" && backorlay === "lay") {
      lossamount = (money * rate) / 100;
      winamount = money;
    }
    const user = await Betuser.findById(userid);
    if (!user) {
      return res.status(404).json({ message: "User not found", status: false });
    }
    if (lossamount > user.irp) {
      return res
        .status(400)
        .json({ message: "Insufficient Balance", status: false, user });
    }

    const savedBet = await Betplace.create({
      userid,
      mid,
      rate,
      sid,
      backorlay,
      gmid,
      money,
      matchname,
      tournament,
      type,
      winamount,
      lossamount,
      locationInfo,
      selection: selectedbetname
    });

    const remainingBalance = user.irp - lossamount;
    await Betuser.findByIdAndUpdate(userid, { irp: remainingBalance });

    res
      .status(201)
      .json({
        message: "Bet placed successfully",
        bet: savedBet,
      });
  } catch (error) {
    console.error("Error placing bet:", error);
    res
      .status(500)
      .json({ message: "Failed to place bet", error: error.message });
  }
};

export const betListHistory = async (req, res) => {
  try {
    const userid = req.user._id;
    const { 
      startDate, 
      endDate, 
      gmid, 
      status,
      page,
      limit
    } = req.body;

    // Validate pagination parameters
    const parsedPage = Math.max(1, parseInt(page));
    const parsedLimit = Math.max(1, Math.min(parseInt(limit), 100));

    // Build the query object
    const query = { userid };
    
    // Handle date filtering (exact match for time if same start/end)
    if (startDate && endDate) {
      if (startDate === endDate) {
        // Exact timestamp match
        query.createdAt = new Date(startDate);
      } else {
        // Date range
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        query.createdAt = {
          $gte: start,
          $lte: end
        };
      }
    }

    // Handle gmid/mid filter - check both fields
    if (gmid) {
      query.$or = [{ gmid: gmid }];
    }

    // Add status filter if provided
    if (status) {
      query.status = status;
    }

    // Calculate skip value for pagination
    const skip = (parsedPage - 1) * parsedLimit;

    // Get total count of documents
    const total = await Betplace.countDocuments(query);

    // Fetch paginated bet history
    const betHistory = await Betplace.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parsedLimit)
      .lean();

    if (!betHistory || betHistory.length === 0) {
      return res.status(404).json({ 
        message: "No bets found for the given criteria", 
        status: false,
        query: query // Returning the query for debugging
      });
    }

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / parsedLimit);
    const hasNextPage = parsedPage < totalPages;
    const hasPreviousPage = parsedPage > 1;
    const gamedatalist = [
        { "eid": 4, "ename": "Cricket" },
        { "eid": 1, "ename": "Football"},
        {  "eid": 2,  "ename": "Tennis" },
        {  "eid": 68, "ename": "Esoccer" },
        {  "eid": 10, "ename": "Horse Racing" },
        { "eid": 65,  "ename": "Greyhound Racing" },
        {  "eid": 8, "ename": "Table Tennis" },
        {  "eid": 15, "ename": "Basketball" },
        { "eid": 6, "ename": "Boxing",},
        {  "eid": 3, "ename": "Mixed Martial Arts" },
        {  "eid": 58,  "ename": "American Football"},
        {  "eid": 18,  "ename": "Volleyball"},
        {  "eid": 22, "ename": "Badminton" },
        { "eid": 59, "ename": "Snooker" },
        {  "eid": 19,  "ename": "Ice Hockey" },
        {  "eid": 11,  "ename": "E Games" },
        {  "eid": 40,  "ename": "Politics" },
        {  "eid": 9, "ename": "Futsal" },
        {  "eid": 39,  "ename": "Handball"},
        { "eid": 52, "ename": "Motor Sports",},
        {  "eid": 12, "ename": "Greyhounds" },
        { "eid": 5, "ename": "Golf",},
        { "eid": 55, "ename": "Rugby League" },
        {  "eid": 7, "ename": "Beach Volleyball"},
        { "eid": 13, "ename": "Trotting" },
        {  "eid": 14, "ename": "Speedway" },
        { "eid": 16, "ename": "MotoGP" },
        {  "eid": 17, "ename": "Chess"},
        { "eid": 20, "ename": "Equine Sports",},
        { "eid": 21, "ename": "Australian Rules"},
        {  "eid": 67, "ename": "Boat Racing"},
        { "eid": 23, "ename": "Formula 1" },
        { "eid": 24, "ename": "Nascar"},
        { "eid": 25, "ename": "Hockey" },
        { "eid": 66, "ename": "Kabaddi" },
        { "eid": 26, "ename": "Supercars"},
        {  "eid": 27, "ename": "Netball"},
        { "eid": 28, "ename": "Surfing"},
        { "eid": 29, "ename": "Cycling"},
        { "eid": 30, "ename": "Gaelic Sports"},
        {  "eid": 31,  "ename": "Biathlon" },
        { "eid": 32, "ename": "Motorbikes"},
        {  "eid": 33,  "ename": "Athletics" },
        { "eid": 34,  "ename": "Squash" },
        { "eid": 35, "ename": "Basketball 3X3"},
        { "eid": 36,  "ename": "Floorball"},
        { "eid": 37, "ename": "Sumo"},
        { "eid": 38, "ename": "Virtual sports" },
        {  "eid": 41, "ename": "Weather"},
        {  "eid": 42, "ename": "TV-Games" },
        { "eid": 43,  "ename": "Lottery"},
        {  "eid": 44,  "ename": "Bowls" },
        {  "eid": 45,  "ename": "Poker" },
        { "eid": 46,  "ename": "Waterpolo" },
        {  "eid": 47, "ename": "Alpine Skiing" },
        { "eid": 48, "ename": "Sailing" },
        {  "eid": 49, "ename": "Hurling"},
        { "eid": 50, "ename": "Ski Jumping" },
        { "eid": 51, "ename": "Bandy"},
        { "eid": 53, "ename": "Baseball" },
        { "eid": 54, "ename": "Rugby Union"},
        { "eid": 56, "ename": "Curling" },
        { "eid": 57, "ename": "Darts"},
        {"eid": 60, "ename": "Gaelic Games"},
        { "eid": 61, "ename": "Lottery Specials"},
        { "eid": 62, "ename": "Soccer"},
        { "eid": 63, "ename": "Special Bets"},
        { "eid": 64, "ename": "Esports"}
    ]
        const processedBets = betHistory.map(bet => {
      // Find sport name
      const sportData = gamedatalist.find(game => game.eid === bet.gmid);
      const sportname = sportData ? sportData.ename : "Unknown Sport";
      return {
       sportname,
      eventname: bet.matchname,
      marketname: bet.type,
      selection: bet.selection,
      type: bet.backorlay,
      oddreq: `${bet.rate}/${bet.lossamount}`,
      stack: bet.money,
      placetime: bet.createdAt,
      matchedtime: bet.updatedAt,
      }
        })
    res.json({ 
      message: "Bets fetched successfully", 
      status: true, 
      data: processedBets,
      pagination: {
        totalItems: total,
        currentPage: parsedPage,
        itemsPerPage: parsedLimit,
        totalPages,
        hasNextPage,
        hasPreviousPage
      }
    });

  } catch (error) {
    console.error("Error fetching bet history:", error);
    res.status(500).json({ 
      message: "Failed to fetch bet history", 
      status: false,
      error: error.message 
    });
  }
};