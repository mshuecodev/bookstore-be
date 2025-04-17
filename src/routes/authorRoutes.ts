import express from "express"
import { getAuthors, getDetailAuthor, addAuthor, updateAuthorDetails, deleteAuthorById } from "../controllers/authorController"
import { authenticate, authorize } from "../middlewares/authMiddleware"

const router = express.Router()

router.post("/", authenticate, authorize(["admin"]), addAuthor) // Create a new author
router.get("/", getAuthors) // Get all authors
router.get("/:id", getDetailAuthor) // Get author by ID
router.put("/:id", authenticate, authorize(["admin"]), updateAuthorDetails) // Update author details by ID
router.delete("/:id", authenticate, authorize(["admin"]), deleteAuthorById) // Delete author by ID

export default router
