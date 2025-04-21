import { Sequelize } from "sequelize"
import { Author } from "../models/Author"
import { Book } from "../models/Book"
import { Genre } from "../models/Genre"

const sequelize = new Sequelize(process.env.DB_NAME || "database", process.env.DB_USER || "postgres", process.env.DB_PASSWORD, {
	host: process.env.DB_HOST || "localhost",
	dialect: "postgres",
	port: Number(process.env.DB_PORT) || 5432,
	logging: false // Disable logging; default: console.log
})

Author.associate()
Book.associate()
Genre.associate()

export const syncDatabase = async () => {
	try {
		await sequelize.authenticate()
		console.log("Database connection has been established successfully.")

		await sequelize.sync({ alter: true })
		console.log("Database synchronized successfully.")
	} catch (error) {
		console.error("Unable to connect to the database:", error)
	}
}

export default sequelize
