import { create } from "domain"
import pool from "../config/database"
import { Publisher } from "../models/publisherModel"

const initializePublishersTable = async () => {
	try {
		await pool.query(`
            CREATE TABLE IF NOT EXISTS publishers (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255),
                address TEXT,
                contactNumber VARCHAR(20),
                email VARCHAR(255)
            );
        `)
		console.log("Publishers table initialized successfully.")
	} catch (error) {
		console.error("Error initializing publishers table:", error)
		throw error
	}
}

export const getAllPublishers = async (): Promise<Publisher[]> => {
	await initializePublishersTable()

	const result = await pool.query("SELECT * FROM publishers")
	return result.rows
}

export const createPublisher = async (publisher: Publisher): Promise<Publisher> => {
	await initializePublishersTable()

	const { name, address, contactNumber, email } = publisher

	const result = await pool.query("INSERT INTO publishers (name, address, contactNumber, email) VALUES ($1, $2, $3, $4) RETURNING *", [name, address, contactNumber, email])
	return result.rows[0]
}

export const getPublisherById = async (id: number): Promise<Publisher | null> => {
	await initializePublishersTable()

	const result = await pool.query("SELECT * FROM publishers WHERE id = $1", [id])
	return result.rows.length > 0 ? result.rows[0] : null
}

export const updatePublisher = async (id: number, publisher: Partial<Publisher>): Promise<Publisher | null> => {
	await initializePublishersTable()

	try {
		const fields = Object.keys(publisher)
		const values = Object.values(publisher)

		if (fields.length === 0) {
			throw new Error("No fields to update")
		}

		const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(", ")
		const result = await pool.query(`UPDATE publishers SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`, [...values, id])

		return result.rows.length > 0 ? result.rows[0] : null
	} catch (error) {
		console.error("Error updating publisher:", error)
		throw error
	}
}

export const deletePublisher = async (id: number): Promise<boolean> => {
	await initializePublishersTable()

	const result = await pool.query("DELETE FROM publishers WHERE id = $1", [id])
	return result.rowCount !== null && result.rowCount > 0
}
