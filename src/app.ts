import express from "express"
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"

import bookRoutes from "./routes/book.routes"
import userRoutes from "./routes/user.routes"
import genreRoutes from "./routes/genre.routes"
import authorRoutes from "./routes/author.routes"
import authRoutes from "./routes/auth.routes"

const app = express()

// Middleware: Security headers
app.use(helmet())
// Middleware: CORS configuration
const corsOptions = {
	origin: process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:3000"], // Allowed origins
	methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
	allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
	credentials: true // Allow cookies and credentials
}
app.use(cors(corsOptions))
// Middleware: Logging HTTP requests
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev")) // Detailed logs for development
} else {
	app.use(morgan("combined")) // Standard logs for production
}

app.use(express.json())

app.use("/books", bookRoutes)
app.use("/users", userRoutes)
app.use("/genres", genreRoutes)
app.use("/authors", authorRoutes)
app.use("/auth", authRoutes)

app.use(notFoundHandler)
app.use(errorHandler)

export default app
