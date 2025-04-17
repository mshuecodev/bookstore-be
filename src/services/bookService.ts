import pool from "../config/database"
import { Book } from "../models/bookModel"

const initializeBooksTable = async () => {
	try {
		await pool.query(`
           CREATE TABLE IF NOT EXISTS books (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255),
                author VARCHAR(255),
                genre VARCHAR(100),
                publishedDate DATE,
                summary TEXT,
                coverImage TEXT,
                rating NUMERIC(3, 2),
                reviews INTEGER DEFAULT 0,
                price NUMERIC(10, 2),
                stock INTEGER DEFAULT 0,
                publisher VARCHAR(255)
            );
        `)
		console.log("Books table initialized successfully.")
	} catch (error) {
		console.error("Error initializing books table:", error)
		throw error
	}
}

export const getAllBooks = async (): Promise<Book[]> => {
	// Ensure the table exists before querying
	await initializeBooksTable()

	const result = await pool.query("SELECT * FROM books")
	return result.rows
}

export const getBookById = async (id: number): Promise<Book | null> => {
	// Ensure the table exists before querying
	await initializeBooksTable()

	const result = await pool.query("SELECT * FROM books WHERE id = $1", [id])
	return result.rows.length > 0 ? result.rows[0] : null
}

export const createBook = async (book: Book): Promise<Book> => {
	// Ensure the table exists before inserting
	await initializeBooksTable()

	const { title = null, author = null, genre = null, publishedDate = null, summary = null, coverImage = null, rating = null, reviews = 0, price = null, stock = 0, publisher = null } = book

	const result = await pool.query("INSERT INTO books (title, author, genre, publishedDate, summary, coverImage, rating, reviews, price, stock, publisher) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *", [title, author, genre, publishedDate, summary, coverImage, rating, reviews, price, stock, publisher])
	return result.rows[0]
}

export const addGenresToBook = async (bookId: number, genres: string[]): Promise<Book | null> => {
	// Ensure the table exists before updating
	await initializeBooksTable()

	try {
		const result = await pool.query("UPDATE books SET genres = $1 WHERE id = $2 RETURNING *", [genres, bookId])
		return result.rows.length > 0 ? result.rows[0] : null
	} catch (error) {
		console.error("Error adding genres to book:", error)
		throw error
	}
}

export const getBooksbyGenre = async (genre: string): Promise<Book[]> => {
	// Ensure the table exists before querying
	await initializeBooksTable()

	const result = await pool.query("SELECT * FROM books WHERE genre = $1", [genre])
	return result.rows
}

export const updateBook = async (id: number, book: Partial<Book>): Promise<Book | null> => {
	// Ensure the table exists before updating
	await initializeBooksTable()

	try {
		const fields = Object.keys(book)
		const values = Object.values(book)

		if (fields.length === 0) {
			throw new Error("No fields to update")
		}

		const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(", ")
		const result = await pool.query(`UPDATE books SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`, [...values, id])

		return result.rows.length > 0 ? result.rows[0] : null
	} catch (error) {
		console.error("Error updating book:", error)
		throw error
	}
}

export const deleteBook = async (id: number): Promise<boolean> => {
	// Ensure the table exists before deleting
	await initializeBooksTable()

	const result = await pool.query("DELETE FROM books WHERE id = $1", [id])
	return result.rowCount !== null && result.rowCount > 0
}
