import express from "express"
import { createGenreController, getAllGenresController, getGenreByIdController, updateGenreController, deleteGenreController } from "../controllers/genre.controller"

const router = express.Router()

router.post("/", createGenreController)
router.get("/", getAllGenresController)
router.get("/:id", getGenreByIdController)
router.put("/:id", updateGenreController)
router.delete("/:id", deleteGenreController)

export default router
