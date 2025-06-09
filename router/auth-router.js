import express from 'express';
const authrouter = express.Router();

import * as authcontrollers from '../controllers/auth-controller.js';
import signupSchema from '../validators/auth-validator.js';
import loginSchema from '../validators/login-validator.js';
import validate from '../middlewares/validate-middleware.js';
import authMiddleware from '../middlewares/auth-middleware.js';
import updateSchema from '../validators/update-validator.js';
import { authenticateToken } from "../middlewares/validtoken-middleware.js";

authrouter.route("/").get(authcontrollers.home);
authrouter.route("/register").post(authenticateToken, validate(signupSchema), authcontrollers.register);
authrouter.route("/login").post(validate(loginSchema), authcontrollers.login);
authrouter.route("/admin-login").post(validate(loginSchema), authcontrollers.login);
authrouter.route("/searchuser").post(authenticateToken, authcontrollers.searchUser);
authrouter.route("/update").post(authenticateToken, validate(updateSchema), authcontrollers.updatePassword);
authrouter.route("/user").get(authenticateToken, authMiddleware, authcontrollers.user);
authrouter.route("/password-history").get(authenticateToken, authMiddleware, authcontrollers.passwordhistory);

export default authrouter;
