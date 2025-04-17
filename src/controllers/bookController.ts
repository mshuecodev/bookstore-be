import { Request, Response } from "express"
import { getAllBooks, createBook, updateBook, deleteBook, getBookById, getBooksbyGenre, addGenresToBook } from "../services/bookService"

export const getBooks = async (req: Request, res: Response) => {
	try {
		const books = await getAllBooks()
		res.status(200).json(books)
	} catch (error) {
		res.status(500).json({ message: "Error fetching books", error })
	}
}

export const getBookDetails = async (req: Request, res: Response) => {
	try {
		const { id } = req.params
		const book = await getBookById(Number(id))
		if (book) {
			res.status(200).json(book)
		} else {
			res.status(404).json({ message: "Book not found" })
		}
	} catch (error) {
		res.status(500).json({ message: "Error fetching book details", error })
	}
}

export const getBooksByGenre = async (req: Request, res: Response) => {
	try {
		const { genre } = req.params
		const books = await getBooksbyGenre(genre)
		if (books.length > 0) {
			res.status(200).json(books)
		} else {
			res.status(404).json({ message: "No books found for this genre" })
		}
	} catch (error) {
		res.status(500).json({ message: "Error fetching books by genre", error })
	}
}

export const addBook = async (req: Request, res: Response) => {
	try {
		const book = req.body
		const newBook = await createBook(book)
		res.status(201).json(newBook)
	} catch (error) {
		res.status(500).json({ message: "Error adding book", error })
	}
}

export const addGenresToBookCtrl = async (req: Request, res: Response) => {
	try {
		const { id } = req.params
		const { genres } = req.body
		const updatedBook = await addGenresToBook(Number(id), genres)
		if (updatedBook) {
			res.status(200).json(updatedBook)
		} else {
			res.status(404).json({ message: "Book not found" })
		}
	} catch (error) {
		res.status(500).json({ message: "Error adding genres to book", error })
	}
}

export const updateBookById = async (req: Request, res: Response) => {
	try {
		const { id } = req.params
		const book = req.body
		const updatedBook = await updateBook(Number(id), book)
		if (updatedBook) {
			res.status(200).json(updatedBook)
		} else {
			res.status(404).json({ message: "Book not found" })
		}
	} catch (error) {
		res.status(500).json({ message: "Error updating book", error })
	}
}

export const deleteBookById = async (req: Request, res: Response) => {
	try {
		const { id } = req.params
		const deleted = await deleteBook(Number(id))
		if (deleted) {
			res.status(204).send()
		} else {
			res.status(404).json({ message: "Book not found" })
		}
	} catch (error) {
		res.status(500).json({ message: "Error deleting book", error })
	}
}
