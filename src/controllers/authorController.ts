import { Request, Response } from "express"
import { getAllAuthors, createAuthor, getAuthorById, updateAuthor, deleteAuthor } from "../services/authorService"

export const getAuthors = async (req: Request, res: Response) => {
	try {
		const authors = await getAllAuthors()
		res.status(200).json(authors)
	} catch (error) {
		res.status(500).json({ message: "Error fetching authors", error })
	}
}

export const addAuthor = async (req: Request, res: Response) => {
	try {
		const author = req.body
		const newAuthor = await createAuthor(author)
		res.status(201).json(newAuthor)
	} catch (error) {
		res.status(500).json({ message: "Error adding author", error })
	}
}

export const getDetailAuthor = async (req: Request, res: Response) => {
	try {
		const authorId = parseInt(req.params.id)
		const author = await getAuthorById(authorId)
		if (author) {
			res.status(200).json(author)
		} else {
			res.status(404).json({ message: "Author not found" })
		}
	} catch (error) {
		res.status(500).json({ message: "Error fetching author", error })
	}
}

export const updateAuthorDetails = async (req: Request, res: Response) => {
	try {
		const authorId = parseInt(req.params.id)
		const authorData = req.body
		const updatedAuthor = await updateAuthor(authorId, authorData)
		if (updatedAuthor) {
			res.status(200).json(updatedAuthor)
		} else {
			res.status(404).json({ message: "Author not found" })
		}
	} catch (error) {
		res.status(500).json({ message: "Error updating author", error })
	}
}

export const deleteAuthorById = async (req: Request, res: Response) => {
	try {
		const authorId = parseInt(req.params.id)
		const deleted = await deleteAuthor(authorId)
		if (deleted) {
			res.status(200).json({ message: "Author deleted successfully" })
		} else {
			res.status(404).json({ message: "Author not found" })
		}
	} catch (error) {
		res.status(500).json({ message: "Error deleting author", error })
	}
}
