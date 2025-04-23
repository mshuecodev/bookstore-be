import { Request, Response, NextFunction } from "express"
import { createAuthor, getAllAuthors, getAuthorById, updateAuthor, deleteAuthor, addBooksToAuthor, removeBooksFromAuthor } from "../services/author.service"

// Create a new author
export const createAuthorController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const author = await createAuthor(req.body)
		res.status(201).json(author)
	} catch (error: any) {
		next(error) // Pass the error to the centralized error handler
	}
}

// Get all authors
export const getAllAuthorsController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const authors = await getAllAuthors()
		res.status(200).json(authors)
	} catch (error: any) {
		next(error) // Pass the error to the centralized error handler
	}
}

// Get a specific author by ID
export const getAuthorByIdController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const author = await getAuthorById(Number(req.params.id))
		if (!author) {
			res.status(404).json({ error: "Author not found" })
		} else {
			res.status(200).json(author)
		}
	} catch (error: any) {
		next(error) // Pass the error to the centralized error handler
	}
}

// Update an author by ID
export const updateAuthorController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const author = await updateAuthor(Number(req.params.id), req.body)
		res.status(200).json(author)
	} catch (error: any) {
		next(error) // Pass the error to the centralized error handler
	}
}

// Delete an author by ID
export const deleteAuthorController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		let deletedAuthor = await deleteAuthor(Number(req.params.id))
		// res.status(204).send() // No content
		res.status(200).json(deletedAuthor)
	} catch (error: any) {
		next(error) // Pass the error to the centralized error handler
	}
}

// Add books to an author
export const addBooksToAuthorController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { bookIds } = req.body
		const author = await addBooksToAuthor(Number(req.params.id), bookIds)
		res.status(200).json(author)
	} catch (error: any) {
		next(error) // Pass the error to the centralized error handler
	}
}

// Remove books from an author
export const removeBooksFromAuthorController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { bookIds } = req.body
		const author = await removeBooksFromAuthor(Number(req.params.id), bookIds)
		res.status(200).json(author)
	} catch (error: any) {
		next(error) // Pass the error to the centralized error handler
	}
}
