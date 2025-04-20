import express from "express"
import { createBookController, getAllBooksController, getBookByIdController, updateBookController, deleteBookController } from "../controllers/book.controller"

const router = express.Router()

router.post("/", createBookController)
router.get("/", getAllBooksController)
router.get("/:id", getBookByIdController)
router.put("/:id", updateBookController)
router.delete("/:id", deleteBookController)

export default router
