import { Sequelize } from "sequelize"
import { Client } from "pg"
import dotenv from "dotenv"
dotenv.config()

const dbName = process.env.DB_NAME || "bookstore"
const dbUser = process.env.DB_USER || "postgres"
const dbPassword = process.env.DB_PASSWORD || ""
const dbHost = process.env.DB_HOST || "localhost"
const dbPort = process.env.DB_PORT || 5432

// ENSURE THE DB EXISTS
const ensureDatabaseExists = async () => {
	const client = new Client({
		user: dbUser,
		host: dbHost,
		database: "postgres",
		password: dbPassword,
		port: Number(dbPort)
	})

	try {
		await client.connect()
		const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = '${dbName}'`)
		if (res.rowCount === 0) {
			console.log(`Database ${dbName} does not exist. Creating...`)
			await client.query(`CREATE DATABASE ${dbName}`)
			console.log(`Database ${dbName} created successfully.`)
		} else {
			console.log(`Database ${dbName} already exists.`)
		}
	} catch (error) {
		console.error("Error ensuring database exists:", error)
	} finally {
		await client.end()
	}
}

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
	host: dbHost,
	port: Number(dbPort),
	dialect: "postgres",
	logging: false
})

export const syncDatabase = async () => {
	await ensureDatabaseExists()
	try {
		await sequelize.authenticate()
		console.log("Connection to the database has been established successfully.")
		await sequelize.sync({ force: false }) // Set to true for development to reset the database
		console.log("Database synchronized successfully.")
	} catch (error) {
		console.error("Unable to connect to the database:", error)
		throw error
	}
}

export default sequelize
