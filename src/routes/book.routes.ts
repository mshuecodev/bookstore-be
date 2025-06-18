import express from "express"
import { createBookController, getAllBooksController, getBookByIdController, updateBookController, deleteBookController } from "../controllers/book.controller"
import { authenticate, authorize } from "../middlewares/auth.middleware"

const router = express.Router()

router.post("/", authenticate, authorize(["admin"]), createBookController)
router.get("/", authenticate, getAllBooksController)
router.get("/:id", authenticate, getBookByIdController)
router.put("/:id", authenticate, updateBookController)
router.delete("/:id", authenticate, deleteBookController)

export default router
