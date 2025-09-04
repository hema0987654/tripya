import express from 'express'
import dotenv from 'dotenv';
dotenv.config();
import connectToDatabase from "./configs/db.js";
import mountRouter from "./routes/indexRoute.js";
import cors from 'cors';
import authRoute from './routes/authRoute.js'

const app=express();

const port=process.env.port;
connectToDatabase();
app.use(express.json());


app.use('/api/v1',authRoute)




app.use((err,req,res,next)=>{
const message=err.message;
const statuscode=err.statusCode||500;



res.status(statuscode).json({"message":message})
next();
})



app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
    
})


