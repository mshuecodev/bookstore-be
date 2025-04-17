import app from "./app"
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler"

const PORT = process.env.PORT || 5000

// app.use("/", (req, res) => {
// 	res.send("Welcome to the Book Store API")
// })

app.use(errorHandler)
app.use(notFoundHandler)

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`)
})
