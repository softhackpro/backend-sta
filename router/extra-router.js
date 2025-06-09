import express from 'express';
const extrarouter = express.Router();

import * as extracontrollers from '../controllers/extra-controller.js';
import { authenticateToken } from "../middlewares/validtoken-middleware.js";


extracontrollers.route("/save-multi-markets").post(authenticateToken, extracontrollers.savemultimarkets);
extracontrollers.route("/get-multi-markets").get(authenticateToken, extracontrollers.getmultimarkets);
export default extracontrollers;