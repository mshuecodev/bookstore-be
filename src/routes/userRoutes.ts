import express from "express"
import { getUsers, getDetailUser, updateUserDetails, deleteUserById } from "../controllers/userController"

import { authenticate, authorize } from "../middlewares/authMiddleware"

const router = express.Router()

router.get("/", authenticate, authorize(["admin"]), getUsers)
router.get("/:id", authenticate, authorize(["admin"]), getDetailUser)
router.put("/:id", authenticate, authorize(["admin"]), updateUserDetails)
router.delete("/:id", authenticate, authorize(["admin"]), deleteUserById)

export default router
