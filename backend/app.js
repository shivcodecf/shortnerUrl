// app.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import userRoute from './routes/user.route.js';
import urlRoute from './routes/url.route.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());

app.use('/api/user', userRoute);
app.use('', urlRoute);

export default app;
