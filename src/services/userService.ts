import { initializeUserTable } from "./authService"
import pool from "../config/database"

export const getAllUsers = async (): Promise<any[]> => {
	await initializeUserTable()

	try {
		const result = await pool.query(`
			SELECT id, name, email, role, createdAt FROM   users
			`)

		return result.rows
	} catch (error) {
		console.log("Error fetching users:", error)
		throw new Error("Failed to fetch users")
	}
}

export const getUserById = async (id: number): Promise<any | null> => {
	await initializeUserTable()

	try {
		const result = await pool.query(`SELECT id, name, email, role, role, createdAt FROM users WHERE id = $1`, [id])

		if (result.rows.length === 0) {
			return null
		}

		return result.rows[0]
	} catch (error) {
		throw new Error("Failed to fetch user")
	}
}

export const updateUser = async (id: number, userData: Partial<any>): Promise<any | null> => {
	await initializeUserTable()

	try {
		const result = await pool.query(`UPDATE users SET name = $1, email = $2, role = $3 WHERE id = $4 RETURNING id, name, email, role`, [userData.name, userData.email, userData.role, id])

		if (result.rows.length === 0) {
			return null
		}

		return result.rows[0]
	} catch (error) {
		console.log("Error updating user:", error)
		throw new Error("Failed to update user")
	}
}

export const deleteUser = async (id: number): Promise<boolean> => {
	await initializeUserTable()

	try {
		const result = await pool.query(`DELETE FROM users WHERE id = $1`, [id])

		if (result.rowCount === 0) {
			return false
		}

		return true
	} catch (error) {
		console.log("Error deleting user:", error)
		throw new Error("Failed to delete user")
	}
}
