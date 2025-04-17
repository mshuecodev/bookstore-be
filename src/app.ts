import express from "express"
import cors from "cors"
import dotenv from "dotenv"

import bookRouter from "./routes/bookRoutes"
import authorRouter from "./routes/authorRoutes"
import genreRouter from "./routes/genreRoutes"
import publisherRouter from "./routes/publisherRoutes"

import authRouter from "./routes/authRoutes"
import userRouter from "./routes/userRoutes"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.use("/books", bookRouter)
app.use("/authors", authorRouter)
app.use("/genres", genreRouter)
app.use("/publishers", publisherRouter)
app.use("/auth", authRouter)
app.use("/users", userRouter)

export default app
