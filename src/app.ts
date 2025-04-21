import express from "express"
import bookRoutes from "./routes/book.routes"
import userRoutes from "./routes/user.routes"
import genreRoutes from "./routes/genre.routes"
import authorRoutes from "./routes/author.routes"

const app = express()

app.use(express.json())

app.use("/api/books", bookRoutes)
app.use("/api/users", userRoutes)
app.use("/api/genres", genreRoutes)
app.use("/api/authors", authorRoutes)

export default app
