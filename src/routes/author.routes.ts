import express from "express"
import { createAuthorController, getAllAuthorsController, getAuthorByIdController, updateAuthorController, deleteAuthorController, addBooksToAuthorController, removeBooksFromAuthorController } from "../controllers/author.controller"

const router = express.Router()

router.post("/", createAuthorController) // Create a new author
router.get("/", getAllAuthorsController) // Get all authors
router.get("/:id", getAuthorByIdController) // Get a specific author by ID
router.put("/:id", updateAuthorController) // Update an author by ID
router.delete("/:id", deleteAuthorController) // Delete an author by ID
router.post("/:id/books", addBooksToAuthorController) // Add books to an author
router.delete("/:id/books", removeBooksFromAuthorController) // Remove books from an author

export default router
