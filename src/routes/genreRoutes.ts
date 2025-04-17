import express from "express"
import { getGenres, addGenre, getDetailGenre, updateGenrebyID, deleteGenreById } from "../controllers/genreController"
import { authenticate, authorize } from "../middlewares/authMiddleware"

const router = express.Router()

router.post("/", authenticate, authorize(["admin"]), addGenre) // Create a new genre
router.get("/", getGenres) // Get all genres
router.get("/:id", getDetailGenre) // Get genre by ID
router.put("/:id", authenticate, authorize(["admin"]), updateGenrebyID) // Update genre details by ID
router.delete("/:id", authenticate, authorize(["admin"]), deleteGenreById) // Delete genre by ID

export default router
