import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './utils/db.js';
import errorMiddleware from './middlewares/error-middleware.js';
import authrouter from './router/auth-router.js';
import betplacerouter from './router/betplace-router.js';
import bankrouter from './router/bank-router.js';
import profitlossrouter from './router/profitloss-router.js';
// import { strictDomainValidator } from './middlewares/domaincheck.js';

const app = express();

// CORS options
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://www.hindwana.com",
    "https://hindwana.com",
    "http://hindwana.com",
    "http://www.hindwana.com",
    "admin.hindwana.com"
  ],
  methods: "GET, POST, PUT, PATCH, DELETE, HEAD",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Enable CORS and JSON parsing
app.use(cors(corsOptions));
app.use(express.json());

// Handle __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files
app.use('/public/Images', express.static(path.join(__dirname, 'public/Images')));
// app.use(strictDomainValidator);
// Routes
app.use("/api/auth", authrouter);
app.use("/api/betplace", betplacerouter);
app.use("/api/banking", bankrouter);
app.use("/api/pl", profitlossrouter);
// Error middleware
app.use(errorMiddleware);

const PORT = process.env.PORT;

// Connect to DB and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`server is running: ${PORT}`);
  });
});
