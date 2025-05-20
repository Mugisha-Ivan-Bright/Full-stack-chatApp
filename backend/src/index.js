import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import cors from 'cors'
import { app, io, server } from './lib/socket.js';
dotenv.config()
import path from 'path';
import { fileURLToPath } from 'url';

app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}
))

import { connectDB } from './lib/db.js'
import authRoutes from './routes/auth.route.js'
import messageRoute from './routes/messages.route.js';




app.use("/api/auth", authRoutes)
app.use("/api/messages",messageRoute)



const PORT = process.env.PORT

const  __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


if(process.env.NODE_ENV ==="production"){
   app.use(express.static(path.join(__dirname, ".../frontend/chatProject/dist")));

   app.get("*", (req , res)=>{
    res.sendFile(path.join(__dirname,"../frontend/chatProject/dist/index.html"));
   })
}

server.listen(PORT,()=>{
    console.log("server is running on port " + PORT)
    connectDB()
})