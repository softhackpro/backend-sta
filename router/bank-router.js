import express from 'express';
const bankrouter = express.Router();

import * as bankcontrollers from '../controllers/bank-controller.js';
import { authenticateToken } from "../middlewares/validtoken-middleware.js";


bankrouter.route("/account-stmt").get(authenticateToken, bankcontrollers.accountStmt);
export default bankrouter;