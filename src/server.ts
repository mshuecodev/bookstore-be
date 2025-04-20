import app from "./app"
import { syncDatabase } from "./config/database"

const PORT = process.env.PORT || 5000

const startServer = async () => {
	try {
		await syncDatabase()
		app.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}`)
		})
	} catch (error) {
		console.error("Error starting server:", error)
	}
}

startServer()
