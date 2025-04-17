import bcrypt, { compare } from "bcrypt"
import jwt from "jsonwebtoken"
import pool from "../config/database"

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret" // Replace with your actual secret

export const initializeUserTable = async () => {
	try {
		await pool.query(`
			CREATE TABLE IF NOT EXISTS users (
				id SERIAL PRIMARY KEY,
				name VARCHAR(255) NOT NULL,
				email VARCHAR(255) UNIQUE NOT NULL,
				password VARCHAR(255),
				role VARCHAR(50) DEFAULT 'customer',
				createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
			)
			`)

		console.log("users table initialized successfully.")
	} catch (error) {
		console.log("Error initalizing user table!")
		throw error
	}
}

export const hashPassword = async (password: string): Promise<string> => {
	const saltRounds = 10
	return await bcrypt.hash(password, saltRounds)
}

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
	return await bcrypt.compare(password, hash)
}

export const generateToken = (userId: number, role: string): string => {
	return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: "1h" })
}

export const verifyToken = (token: string): any => {
	try {
		return jwt.verify(token, JWT_SECRET)
	} catch (error) {
		return null
	}
}

export const registerUser = async (name: string, email: string, password: string, role: string = "customer"): Promise<any> => {
	await initializeUserTable()

	try {
		const hashedPassword = await hashPassword(password)

		const result = await pool.query(`INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, createdAt`, [name, email, hashedPassword, role])

		return result.rows[0]
	} catch (error) {
		console.log("Error registering user:", error)
		throw new Error("Failed to register user!")
	}
}

export const loginUser = async (email: string, password: string): Promise<{ token: string; user: any }> => {
	await initializeUserTable()

	try {
		const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email])

		if (result.rows.length === 0) {
			throw new Error("Invalid email or password")
		}

		const user = result.rows[0]

		const isPasswordValid = await comparePassword(password, user.password)

		if (!isPasswordValid) {
			throw new Error("Invalid email or password")
		}

		console.log("user", user)

		const token = generateToken(user.id, user.role)

		return {
			token,
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
				role: user.role,
				createdAt: user.createdAt
			}
		}
	} catch (error) {
		console.log("Error logging in user:", error)
		throw new Error("Failed to log in user!")
	}
}
