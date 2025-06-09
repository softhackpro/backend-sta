import express from 'express';
const profitlossrouter = express.Router();

import * as profitlosscontrollers from '../controllers/profitloss-controller.js';
import { authenticateToken } from "../middlewares/validtoken-middleware.js";


profitlossrouter.route("/first").get(authenticateToken, profitlosscontrollers.first);
profitlossrouter.route("/second").get(authenticateToken, profitlosscontrollers.second);
profitlossrouter.route("/third").get(authenticateToken, profitlosscontrollers.third);
profitlossrouter.route("/fourth").get(authenticateToken, profitlosscontrollers.fourth);
export default profitlossrouter;