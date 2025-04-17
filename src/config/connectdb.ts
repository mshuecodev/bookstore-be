import { Pool, Client } from "pg"
import dotenv from "dotenv"

dotenv.config()

const { DATABASE_URL, DATABASE_NAME } = process.env

// Function to create the database if it doesn't exist
const createDatabaseIfNotExists = async () => {
	try {
		// Connect to the default 'postgres' database
		const client = new Client({
			connectionString: DATABASE_URL,
			database: "postgres" // Connect to the default database
		})

		await client.connect()

		// Check if the target database exists
		const result = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [DATABASE_NAME])

		if (result.rowCount === 0) {
			// Database does not exist, create it
			console.log(`Database "${DATABASE_NAME}" does not exist. Creating it...`)
			await client.query(`CREATE DATABASE "${DATABASE_NAME}"`)
			console.log(`Database "${DATABASE_NAME}" created successfully.`)
		} else {
			console.log(`Database "${DATABASE_NAME}" already exists.`)
		}

		await client.end()
	} catch (error) {
		console.error("Error checking or creating database:", error)
		process.exit(1) // Exit the process if database creation fails
	}
}

// Create a pool for the target database
const pool = new Pool({
	connectionString: DATABASE_URL,
	database: DATABASE_NAME // Use the target database
})

// Ensure the database exists before exporting the pool
;(async () => {
	await createDatabaseIfNotExists()
})()

export default pool
