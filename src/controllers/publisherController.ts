import { Request, Response } from "express"
import { getAllPublishers, createPublisher, getPublisherById, updatePublisher, deletePublisher } from "../services/publisherService"

export const getPublishers = async (req: Request, res: Response) => {
	try {
		const publishers = await getAllPublishers()
		res.status(200).json(publishers)
	} catch (error) {
		res.status(500).json({ message: "Error fetching publishers", error })
	}
}

export const addPublisher = async (req: Request, res: Response) => {
	try {
		const publisher = req.body
		const newPublisher = await createPublisher(publisher)
		res.status(201).json(newPublisher)
	} catch (error) {
		res.status(500).json({ message: "Error adding publisher", error })
	}
}

export const getDetailPublisher = async (req: Request, res: Response) => {
	try {
		const publisherId = parseInt(req.params.id)
		const publisher = await getPublisherById(publisherId)
		if (publisher) {
			res.status(200).json(publisher)
		} else {
			res.status(404).json({ message: "Publisher not found" })
		}
	} catch (error) {
		res.status(500).json({ message: "Error fetching publisher", error })
	}
}

export const updatePublisherDetails = async (req: Request, res: Response) => {
	try {
		const publisherId = parseInt(req.params.id)
		const publisherData = req.body
		const updatedPublisher = await updatePublisher(publisherId, publisherData)
		if (updatedPublisher) {
			res.status(200).json(updatedPublisher)
		} else {
			res.status(404).json({ message: "Publisher not found" })
		}
	} catch (error) {
		res.status(500).json({ message: "Error updating publisher", error })
	}
}

export const deletePublisherById = async (req: Request, res: Response) => {
	try {
		const publisherId = parseInt(req.params.id)
		const deleted = await deletePublisher(publisherId)
		if (deleted) {
			res.status(200).json({ message: "Publisher deleted successfully" })
		} else {
			res.status(404).json({ message: "Publisher not found" })
		}
	} catch (error) {
		res.status(500).json({ message: "Error deleting publisher", error })
	}
}
