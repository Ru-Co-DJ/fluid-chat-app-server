import express from "express"
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import db from "./dbConnection.js";
import userRouter from "./routes/users.js"
import messagingRouter from "./routes/messages.js"
const PORT = 5000;

const app = express()
app.use(express.json());
app.use(cors());




app.listen(PORT,()=>{
    console.log("Server listening on port: ",PORT)
})


app.use("/user",userRouter);
app.use("/messages",messagingRouter)
