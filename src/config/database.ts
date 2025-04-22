import { Sequelize } from "sequelize"
import { Client } from "pg"
import dotenv from "dotenv"
dotenv.config()
// import { Author } from "../models/Author"
// import { Book } from "../models/Book"
// import { Genre } from "../models/Genre"

const dbName = process.env.DB_NAME || "database"
const dbUser = process.env.DB_USER || "postgres"
const dbPassword = process.env.DB_PASSWORD
const dbHost = process.env.DB_HOST || "localhost"
const dbPort = Number(process.env.DB_PORT) || 5432

// Ensure the database exists
const ensureDatabaseExists = async () => {
	const client = new Client({
		user: dbUser,
		password: dbPassword,
		host: dbHost,
		port: dbPort,
		database: "postgres" // Connect to the default "postgres" database
	})

	try {
		await client.connect()
		const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName])

		if (res.rowCount === 0) {
			console.log(`Database "${dbName}" does not exist. Creating...`)
			await client.query(`CREATE DATABASE "${dbName}"`)
			console.log(`Database "${dbName}" created successfully.`)
		} else {
			console.log(`Database "${dbName}" already exists.`)
		}
	} catch (error) {
		console.error("Error ensuring database exists:", error)
		throw error
	} finally {
		await client.end()
	}
}

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
	host: dbHost,
	dialect: "postgres",
	port: dbPort,
	logging: false // Disable logging; default: console.log
})

export const syncDatabase = async () => {
	try {
		await ensureDatabaseExists()
		await sequelize.authenticate()
		console.log("Database connection has been established successfully.")

		await sequelize.sync({ alter: true })
		console.log("Database synchronized successfully.")
	} catch (error) {
		console.error("Unable to connect to the database:", error)
		process.exit(1)
	}
}

export default sequelize
