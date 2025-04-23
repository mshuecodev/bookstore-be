import { Request, Response, NextFunction } from "express"
import { createBook, getAllBooks, getBookById, updateBook, deleteBook } from "../services/book.service"

export const createBookController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const bookData = req.body
		const book = await createBook(bookData)
		res.status(201).json(book)
	} catch (error: any) {
		next(error) // Pass the error to the centralized error handler
	}
}

export const getAllBooksController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const books = await getAllBooks()
		res.status(200).json(books)
	} catch (error: any) {
		next(error) // Pass the error to the centralized error handler
	}
}

export const getBookByIdController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const bookId = parseInt(req.params.id)
		const book = await getBookById(bookId)
		res.status(200).json(book)
	} catch (error: any) {
		next(error) // Pass the error to the centralized error handler
	}
}

export const updateBookController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const bookId = parseInt(req.params.id)
		const bookData = req.body
		const updatedBook = await updateBook(bookId, bookData)
		res.status(200).json(updatedBook)
	} catch (error: any) {
		next(error) // Pass the error to the centralized error handler
	}
}

export const deleteBookController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const bookId = parseInt(req.params.id)
		const deletedBook = await deleteBook(bookId)
		res.status(200).json(deletedBook)
	} catch (error: any) {
		next(error) // Pass the error to the centralized error handler
	}
}
