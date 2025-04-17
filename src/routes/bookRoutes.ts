import expreess from "express"
import { getBooks, addBook, updateBookById, deleteBookById, getBooksByGenre, addGenresToBookCtrl } from "../controllers/bookController"
import { authenticate, authorize } from "../middlewares/authMiddleware"

const router = expreess.Router()

router.get("/", getBooks)
router.post("/", authenticate, authorize(["admin"]), addBook)
router.post("/addGenres/:id", authenticate, authorize(["admin"]), addGenresToBookCtrl)
router.get("/genre/:genre", getBooksByGenre)
router.put("/:id", authenticate, authorize(["admin"]), updateBookById)
router.delete("/:id", authenticate, authorize(["admin"]), deleteBookById)

export default router
