import express from "express"
import { getMyMessages, sendMessage,deleteConv } from "../controllers/messages.js";

const router = express.Router()

router.get("/mymessages",getMyMessages);
router.post("/sendmessage",sendMessage);
router.post("/deleteconv",deleteConv);

export default router;