import pool from "../config/database"
import { Genre } from "../models/genreModel"

const initializeGenresTable = async () => {
	try {
		await pool.query(`
            CREATE TABLE IF NOT EXISTS genres (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            description TEXT,`)

		console.log("Genres table initialized successfully.")
	} catch (error) {
		console.error("Error initializing genres table:", error)
		throw error
	}
}

export const createGenre = async (genre: Genre): Promise<Genre> => {
	await initializeGenresTable()

	const { name, description } = genre

	const result = await pool.query(`INSERT INTO genres (name, description) VALUES ($1, $2) RETURNING *`, [name, description])

	return result.rows[0]
}

export const getAllGenres = async (): Promise<Genre[]> => {
	await initializeGenresTable()

	const result = await pool.query("SELECT * FROM genres")
	return result.rows
}

export const getGenreById = async (id: number): Promise<Genre | null> => {
	await initializeGenresTable()

	const result = await pool.query("SELECT * FROM genres WHERE id = $1", [id])
	return result.rows.length > 0 ? result.rows[0] : null
}

export const updateGenre = async (id: number, genre: Partial<Genre>): Promise<Genre | null> => {
	await initializeGenresTable()

	try {
		const fields = Object.keys(genre)
		const values = Object.values(genre)

		if (fields.length === 0) {
			throw new Error("No fields to update")
		}

		const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(", ")
		const result = await pool.query(`UPDATE genres SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`, [...values, id])

		return result.rows.length > 0 ? result.rows[0] : null
	} catch (error) {
		console.error("Error updating genre:", error)
		throw error
	}
}

export const deleteGenre = async (id: number): Promise<boolean> => {
	await initializeGenresTable()

	const result = await pool.query("DELETE FROM genres WHERE id = $1", [id])
	return result.rowCount !== null && result.rowCount > 0
}
