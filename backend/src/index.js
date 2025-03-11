import express from "express";
import authRoute from "./routes/auth.route.js";
import message from "./routes/message.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import {app,server,io} from '../src/lib/socket.js'
import { connectDB } from "./lib/db.js";
import dotenv from "dotenv";
import  bodyParser from 'body-parser'
import path from "path"
dotenv.config();
const _dirname=path.resolve()

// ✅ CORS Configuration (Specific Origin Required for Cookies)
app.use(
  cors({
    origin: "http://localhost:5173", // ✅ Use the correct frontend origin
    credentials: true, // ✅ Allow cookies & auth headers
  })
);

app.use(bodyParser.json({ limit: "10mb" })); // Adjust size as needed
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

app.use(express.json()); // ✅ Parse JSON bodies
app.use(cookieParser()); // ✅ Parse cookies from incoming requests



// ✅ Middleware
app.use(express.json()); // Ensure JSON parsing
connectDB()
// ✅ Fix Routes (Add leading '/')
app.use("/api/auth", authRoute);
app.use("/api/messages", message);


if(process.env.NODE_ENV==="production"){
  app.use(express.static(path.join(_dirname,"../client/dist")))
  app.get("*",(req,res)=>{
    res.sendFile(path.join(_dirname,"../client","/dist", "index.html"))
  })
}
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
