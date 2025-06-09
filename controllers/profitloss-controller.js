import Betplace from "../models/betplace.js";

export const first = async (req, res) => {
  try {
    const id = req.user._id;
    const responses = await Betplace.find({ userid: id }); // Note: find() returns an array

    // Initialize all variables
    let totalcricketwin = 0;
    let totalcricketloss = 0;
    let totalfootballwin = 0;
    let totalfootballloss = 0;
    let totalcasinowin = 0;
    let totalcasinoloss = 0;
    let totalallotherwin = 0;
    let totalallotherloss = 0;

    // Loop through all responses since find() returns an array
    responses.forEach((response) => {
      if (response.gmid === 4) {
        // cricket
        if (response.status === "win") {
          totalcricketwin += response.winamount;
        }
        if (response.status === "loss") {
          totalcricketloss += response.lossamount;
        }
      } else if (response.gmid === 1) {
        // football
        if (response.status === "win") {
          totalfootballwin += response.winamount;
        }
        if (response.status === "loss") {
          totalfootballloss += response.lossamount;
        }
      } else if (response.gmid === 100) {
        // casino
        if (response.status === "win") {
          totalcasinowin += response.winamount;
        }
        if (response.status === "loss") {
          totalcasinoloss += response.lossamount;
        }
      } else {
        // other games
        if (response.status === "win") {
          totalallotherwin += response.winamount;
        }
        if (response.status === "loss") {
          totalallotherloss += response.lossamount;
        }
      }
    });

    // Calculate profits/losses
    const totalprofitforcricket = totalcricketwin - totalcricketloss;
    const totalprofitlossforfootball = totalfootballwin - totalfootballloss;
    const totalprofitlossforcasino = totalcasinowin - totalcasinoloss;
    const totalprofitlossforothergames = totalallotherwin - totalallotherloss;

    const result = {
      cricket: {
        gamename: "Cricket",
        gmid: 4,
        netProfit: totalprofitforcricket,
      },
      football: {
        gamename: "Football",
        gmid: 1,
        netProfit: totalprofitlossforfootball,
      },
      casino: {
        gamename: "Casino",
        gmid: 100,
        netProfit: totalprofitlossforcasino,
      },
      otherGames: {
        gamename: "Others",
        gmid: 10000,
        netProfit: totalprofitlossforothergames,
      },
    };

    res.status(200).json({result, status: true});
  } catch (error) {
    console.error("Error in first function:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const second = async (req, res) => {
    try {
        const id = req.user._id;
        const { limit = 10, gmid, startdate, enddate, page = 1 } = req.body; // Defaults: limit=10, page=1

        // Build the query object
        const query = { userid: id };

        // Add gmid filter if provided
        if (gmid) {
            if (gmid === 10000) {
                // Show all other games (exclude common games like cricket, football, casino)
                query.gmid = { $nin: [4, 1, 100] };
            } else {
                query.gmid = gmid;
            }
        }

        // Add date range filter if provided
        if (startdate && enddate) {
            query.createdAt = {
                $gte: new Date(startdate), // Greater than or equal to startdate
                $lte: new Date(enddate)   // Less than or equal to enddate
            };
        }

        // Calculate skip for pagination
        const skip = (page - 1) * limit;

        // Fetch data with filters, pagination, and sorting (newest first)
        const bets = await Betplace.find(query)
            .sort({ createdAt: -1 }) // Sort by newest first
            .skip(skip)
            .limit(limit);

        const gamedatalist = [
            { "eid": 4, "ename": "Cricket" },
            { "eid": 1, "ename": "Football"},
            { "eid": 2, "ename": "Tennis" },
            { "eid": 68, "ename": "Esoccer" },
            { "eid": 10, "ename": "Horse Racing" },
            { "eid": 65, "ename": "Greyhound Racing" },
            { "eid": 8, "ename": "Table Tennis" },
            { "eid": 15, "ename": "Basketball" },
            { "eid": 6, "ename": "Boxing"},
            { "eid": 3, "ename": "Mixed Martial Arts" },
            { "eid": 58, "ename": "American Football"},
            { "eid": 18, "ename": "Volleyball"},
            { "eid": 22, "ename": "Badminton" },
            { "eid": 59, "ename": "Snooker" },
            { "eid": 19, "ename": "Ice Hockey" },
            { "eid": 11, "ename": "E Games" },
            { "eid": 40, "ename": "Politics" },
            { "eid": 9, "ename": "Futsal" },
            { "eid": 39, "ename": "Handball"},
            { "eid": 52, "ename": "Motor Sports"},
            { "eid": 12, "ename": "Greyhounds" },
            { "eid": 5, "ename": "Golf"},
            { "eid": 55, "ename": "Rugby League" },
            { "eid": 7, "ename": "Beach Volleyball"},
            { "eid": 13, "ename": "Trotting" },
            { "eid": 14, "ename": "Speedway" },
            { "eid": 16, "ename": "MotoGP" },
            { "eid": 17, "ename": "Chess"},
            { "eid": 20, "ename": "Equine Sports"},
            { "eid": 21, "ename": "Australian Rules"},
            { "eid": 67, "ename": "Boat Racing"},
            { "eid": 23, "ename": "Formula 1" },
            { "eid": 24, "ename": "Nascar"},
            { "eid": 25, "ename": "Hockey" },
            { "eid": 66, "ename": "Kabaddi" },
            { "eid": 26, "ename": "Supercars"},
            { "eid": 27, "ename": "Netball"},
            { "eid": 28, "ename": "Surfing"},
            { "eid": 29, "ename": "Cycling"},
            { "eid": 30, "ename": "Gaelic Sports"},
            { "eid": 31, "ename": "Biathlon" },
            { "eid": 32, "ename": "Motorbikes"},
            { "eid": 33, "ename": "Athletics" },
            { "eid": 34, "ename": "Squash" },
            { "eid": 35, "ename": "Basketball 3X3"},
            { "eid": 36, "ename": "Floorball"},
            { "eid": 37, "ename": "Sumo"},
            { "eid": 38, "ename": "Virtual sports" },
            { "eid": 41, "ename": "Weather"},
            { "eid": 42, "ename": "TV-Games" },
            { "eid": 43, "ename": "Lottery"},
            { "eid": 44, "ename": "Bowls" },
            { "eid": 45, "ename": "Poker" },
            { "eid": 46, "ename": "Waterpolo" },
            { "eid": 47, "ename": "Alpine Skiing" },
            { "eid": 48, "ename": "Sailing" },
            { "eid": 49, "ename": "Hurling"},
            { "eid": 50, "ename": "Ski Jumping" },
            { "eid": 51, "ename": "Bandy"},
            { "eid": 53, "ename": "Baseball" },
            { "eid": 54, "ename": "Rugby Union"},
            { "eid": 56, "ename": "Curling" },
            { "eid": 57, "ename": "Darts"},
            { "eid": 60, "ename": "Gaelic Games"},
            { "eid": 61, "ename": "Lottery Specials"},
            { "eid": 62, "ename": "Soccer"},
            { "eid": 63, "ename": "Special Bets"},
            { "eid": 64, "ename": "Esports"},
            { "eid": 100, "ename": "Casino"},
        ];

        const processedbets = bets.map((bet) => {
            const gameInfo = gamedatalist.find((game) => game.eid === bet.gmid) || {
                ename: "Unknown Game",
            };
            return {
                mid: bet.mid,
                sportname: gameInfo.ename,
                gmid: gameInfo.eid,
                eventname: bet.matchname,
                winamount: bet.winamount,
                lossamount: bet.lossamount,
                commision: 0,
                status: bet.status,
            };
        });

        // Count total records (for pagination info)
        const totalRecords = await Betplace.countDocuments(query);

        // Calculate total pages
        const totalPages = Math.ceil(totalRecords / limit);

        // Response structure
        const response = {
            success: true,
            hint: "agar status loss hai to red aur agar win hai to blue total p&l me aur profit/loss me",
            data: processedbets,
            pagination: {
                currentPage: page,
                totalPages,
                totalRecords,
                limit
            }
        };

        res.json(response);
    } catch (error) {
        console.error("Error in second function:", error);
        res.status(500).json({ 
            success: false,
            error: "Internal server error" 
        });
    }
};

export const third = async (req, res) => {
  try {
    const id = req.user._id;
    const { mid, gmid } = req.body;
    
    // Build the query object
    const query = { userid: id };
    if (mid) query.mid = mid; // Changed from _id to mid to find all bets for a match
    if (gmid) query.gmid = gmid;

    // Find all bets matching the criteria
    const results = await Betplace.find(query); // Using find() to get all matching bets

    if (!results || results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No bets found"
      });
    }

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

    // Process all results
    const processedResults = results.map(result => {
      const gameInfo = gamedatalist.find(game => game.eid === result.gmid) || { ename: "Unknown Game" };
      
      return {
        sportname: gameInfo.ename,
        mid: result.mid,
        gmid: gameInfo.eid,
        eventname: result.matchname,
        marketname: result.type,
        result: result.result,
        winamount: result.winamount,
        lossamount: result.lossamount,
        commission: result.commission,
        settletime: result.updatedAt,
      };
    });

    res.status(200).json({
      success: true,
      data: processedResults,
      count: processedResults.length
    });

  } catch (error) {
    console.error("Error in third function:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
};

export const fourth = async (req, res) => {
  try {
    const { gmid, mid } = req.body;
    
    // Validate required parameters
    if (!gmid || !mid) {
      return res.status(400).json({
        success: false,
        error: "Both gmid and mid are required parameters"
      });
    }

    const results = await find(gmid, mid);
    
    const gamedatalist = [
      { "eid": 4, "ename": "Cricket" },
      { "eid": 1, "ename": "Football" },
      { "eid": 2, "ename": "Tennis" },
      { "eid": 68, "ename": "Esoccer" },
      { "eid": 10, "ename": "Horse Racing" },
      { "eid": 65, "ename": "Greyhound Racing" },
      { "eid": 8, "ename": "Table Tennis" },
      { "eid": 15, "ename": "Basketball" },
      { "eid": 6, "ename": "Boxing" },
      { "eid": 3, "ename": "Mixed Martial Arts" },
      { "eid": 58, "ename": "American Football" },
      { "eid": 18, "ename": "Volleyball" },
      { "eid": 22, "ename": "Badminton" },
      { "eid": 59, "ename": "Snooker" },
      { "eid": 19, "ename": "Ice Hockey" },
      { "eid": 11, "ename": "E Games" },
      { "eid": 40, "ename": "Politics" },
      { "eid": 9, "ename": "Futsal" },
      { "eid": 39, "ename": "Handball" },
      { "eid": 52, "ename": "Motor Sports" },
      { "eid": 12, "ename": "Greyhounds" },
      { "eid": 5, "ename": "Golf" },
      { "eid": 55, "ename": "Rugby League" },
      { "eid": 7, "ename": "Beach Volleyball" },
      { "eid": 13, "ename": "Trotting" },
      { "eid": 14, "ename": "Speedway" },
      { "eid": 16, "ename": "MotoGP" },
      { "eid": 17, "ename": "Chess" },
      { "eid": 20, "ename": "Equine Sports" },
      { "eid": 21, "ename": "Australian Rules" },
      { "eid": 67, "ename": "Boat Racing" },
      { "eid": 23, "ename": "Formula 1" },
      { "eid": 24, "ename": "Nascar" },
      { "eid": 25, "ename": "Hockey" },
      { "eid": 66, "ename": "Kabaddi" },
      { "eid": 26, "ename": "Supercars" },
      { "eid": 27, "ename": "Netball" },
      { "eid": 28, "ename": "Surfing" },
      { "eid": 29, "ename": "Cycling" },
      { "eid": 30, "ename": "Gaelic Sports" },
      { "eid": 31, "ename": "Biathlon" },
      { "eid": 32, "ename": "Motorbikes" },
      { "eid": 33, "ename": "Athletics" },
      { "eid": 34, "ename": "Squash" },
      { "eid": 35, "ename": "Basketball 3X3" },
      { "eid": 36, "ename": "Floorball" },
      { "eid": 37, "ename": "Sumo" },
      { "eid": 38, "ename": "Virtual sports" },
      { "eid": 41, "ename": "Weather" },
      { "eid": 42, "ename": "TV-Games" },
      { "eid": 43, "ename": "Lottery" },
      { "eid": 44, "ename": "Bowls" },
      { "eid": 45, "ename": "Poker" },
      { "eid": 46, "ename": "Waterpolo" },
      { "eid": 47, "ename": "Alpine Skiing" },
      { "eid": 48, "ename": "Sailing" },
      { "eid": 49, "ename": "Hurling" },
      { "eid": 50, "ename": "Ski Jumping" },
      { "eid": 51, "ename": "Bandy" },
      { "eid": 53, "ename": "Baseball" },
      { "eid": 54, "ename": "Rugby Union" },
      { "eid": 56, "ename": "Curling" },
      { "eid": 57, "ename": "Darts" },
      { "eid": 60, "ename": "Gaelic Games" },
      { "eid": 61, "ename": "Lottery Specials" },
      { "eid": 62, "ename": "Soccer" },
      { "eid": 63, "ename": "Special Bets" },
      { "eid": 64, "ename": "Esports" },
      { "eid": 100, "ename": "Casino" }
    ];

    const processedResults = results.map(result => {
      const gameInfo = gamedatalist.find(game => game.eid === result.gmid) || { 
        ename: "Unknown Game" 
      };
      
      return {
        sportname: gameInfo.ename,
        eventname: result.matchname,
        marketname: result.type,
        selectionname: result.selection,
        bettype: result.backorlay,
        amount: result.money,
        userprice: result.rate,
        winamount: result.winamount,
        lossamount: result.lossamount,
        placedate: result.createdAt,
        matchdate: result.updatedAt,
      };
    });

    res.json({
      success: true,
      data: processedResults,
      count: processedResults.length
    });

  } catch (error) {
    console.error("Error in fourth function:", error);
    res.status(500).json({ 
      success: false,
      error: "Internal server error",
      message: error.message 
    });
  }
};