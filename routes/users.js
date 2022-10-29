import express from "express"
import {createUser, login, addFriend, deleteContact} from "../controllers/users.js"
const router = express.Router()

router.post("/signin",createUser)
router.post("/login",login)
router.post("/addfriend", addFriend)
router.post("/deletecontact", deleteContact)


export default router;