import express from "express"
import { registerController, loginController, refreshController, logoutController, requestPasswordResetController, resetPasswordController } from "../controllers/auth.controller"

const router = express.Router()

router.post("/register", registerController)
router.post("/login", loginController)
router.post("/refresh", refreshController)
router.post("/logout", logoutController)
router.post("/request-password-reset", requestPasswordResetController)
router.post("/reset-password", resetPasswordController)

export default router
