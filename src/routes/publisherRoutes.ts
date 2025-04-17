import express from "express"
import { getPublishers, addPublisher, getDetailPublisher, updatePublisherDetails, deletePublisherById } from "../controllers/publisherController"
import { authorize, authenticate } from "../middlewares/authMiddleware"

const router = express.Router()

router.post("/", authenticate, authorize(["admin"]), addPublisher) // Create a new publisher
router.get("/", getPublishers) // Get all publishers
router.get("/:id", getDetailPublisher) // Get publisher by ID
router.put("/:id", authenticate, authorize(["admin"]), updatePublisherDetails) // Update publisher details by ID
router.delete("/:id", authenticate, authorize(["admin"]), deletePublisherById) // Delete publisher by ID

export default router
