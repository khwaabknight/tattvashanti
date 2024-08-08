import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dbConnect from './config/database.js';
import counsellorRouter from './routes/counsellor.route.js';
import cuisineRouter from './routes/cuisine.route.js';
import dishRouter from './routes/dish.route.js';
import dietChartRouter from './routes/dietChart.route.js';
import baseDietChartRouter from './routes/baseDietChart.route.js';
import userRouter from './routes/user.route.js';

import dotenv from 'dotenv';
import createPDF from './utils/pdfUtils/createPdf.js';
import sendDietChartMail from './utils/mailUtils/sendDietChartMail.js';
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

app.get('/api/v1/healthcheck', (_, res) => {
  return res.status(200).json({
    success: true,
    message: "Server is running ❤️"
  })
})

app.use('/api/v1/counsellor', counsellorRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/cuisine', cuisineRouter);
app.use('/api/v1/dish', dishRouter);
app.use('/api/v1/baseDietChart', baseDietChartRouter);
app.use('/api/v1/dietChart', dietChartRouter);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})