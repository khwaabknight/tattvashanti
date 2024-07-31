import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dbConnect from './config/database.js';

import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

dbConnect();

app.use(cors());

app.use(express.json())
// app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


app.get('/', (_, res) => {
  res.send('Hello World!')
})

app.get('/api/healthcheck', (_, res) => {
  return res.status(200).json({
    success: true,
    message: "Server is running ❤️"
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})