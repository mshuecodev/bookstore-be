import pool from "../config/database"
import { Author } from "../models/authorModel"

const initializeAuthorsTable = async () => {
	try {
		await pool.query(`
            CREATE TABLE IF NOT EXISTS authors (
                id: SERIAL PRIMARY KEY,
                name: VARCHAR(255),
                biography: TEXT,
                profilePicture: TEXT,
                birthDate: DATE,
                deathDate: DATE,
                nationality: VARCHAR(100),
            );`)
		console.log("Authors table initialized successfully.")
	} catch (error) {
		console.error("Error initializing authors table:", error)
		throw error
	}
}

export const getAllAuthors = async (): Promise<Author[]> => {
	// Ensure the table exists before querying
	await initializeAuthorsTable()

	const result = await pool.query("SELECT * FROM authors")
	return result.rows
}

export const createAuthor = async (author: Author): Promise<Author> => {
	await initializeAuthorsTable()

	const { name, biography, profilePicture, birthDate, deathDate, nationality } = author

	const result = await pool.query(
		`INSERT INTO authors (name, biography, profilePicture, birthDate, deathDate, nationality)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
		[name, biography, profilePicture, birthDate, deathDate, nationality]
	)

	return result.rows[0]
}

export const getAuthorById = async (id: number): Promise<Author | null> => {
	await initializeAuthorsTable()

	const result = await pool.query("SELECT * FROM authors WHERE id = $1", [id])
	return result.rows.length > 0 ? result.rows[0] : null
}

export const updateAuthor = async (id: number, author: Partial<Author>): Promise<Author | null> => {
	await initializeAuthorsTable()

	try {
		const fields = Object.keys(author)
		const values = Object.values(author)

		if (fields.length === 0) {
			throw new Error("No fields to update")
		}

		const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(", ")

		values.push(id)

		const result = await pool.query(`UPDATE authors SET ${setClause} WHERE id = $${values.length} RETURNING *`, values)

		return result.rows.length > 0 ? result.rows[0] : null
	} catch (error) {
		console.error("Error updating author:", error)
		throw error
	}
}

export const deleteAuthor = async (id: number): Promise<boolean> => {
	await initializeAuthorsTable()

	try {
		const result = await pool.query("DELETE FROM authors WHERE id = $1", [id])
		return (result.rowCount ?? 0) > 0
	} catch (error) {
		console.error("Error deleting author:", error)
		throw error
	}
}
