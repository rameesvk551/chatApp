import express from 'express'
import { protectRoute } from '../middlewares/auth.middleware.js'
import {signup,login,logout,checkAuth,updateProfile} from '../controllers/auth.controller.js'
const router=express.Router()

router.post("/signup",signup)
router.post("/login",login)
router.post("/logout",logout)
router.put("/update-profile",protectRoute,updateProfile)
router.get("/check-auth",protectRoute,checkAuth)
export default router