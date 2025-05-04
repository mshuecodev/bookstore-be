import express from "express"
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware"

import bookRoutes from "./routes/book.routes"
import userRoutes from "./routes/user.routes"
import genreRoutes from "./routes/genre.routes"
import authorRoutes from "./routes/author.routes"
import authRoutes from "./routes/auth.routes"

const app = express()

app.use(express.json())

app.use("/books", bookRoutes)
app.use("/users", userRoutes)
app.use("/genres", genreRoutes)
app.use("/authors", authorRoutes)
app.use("/auth", authRoutes)

app.use(notFoundHandler)
app.use(errorHandler)

export default app
