import express from "express"
import { createBookController, getAllBooksController, getBookByIdController, updateBookController, deleteBookController } from "../controllers/book.controller"
import { authenticate, authorize } from "../middlewares/auth.middleware"

const router = express.Router()

router.post("/", authenticate, authorize(["admin"]), createBookController)
router.get("/", getAllBooksController)
router.get("/:id", getBookByIdController)
router.put("/:id", updateBookController)
router.delete("/:id", deleteBookController)

export default router
