import express from 'express';
const betplacerouter = express.Router();

import * as betplacecontrollers from '../controllers/betplace-controller.js';
import { authenticateToken } from "../middlewares/validtoken-middleware.js";


betplacerouter.route("/").post(authenticateToken, betplacecontrollers.placeBet);
betplacerouter.route("/betHistory").post(authenticateToken, betplacecontrollers.betListHistory);
export default betplacerouter;