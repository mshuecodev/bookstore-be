import sequelize from "../config/database"
import { User } from "./User"
import { Author } from "./Author"
import { Book } from "./Book"
import { Genre } from "./Genre"

// Call associate methods to establish relationships
Author.associate?.()
Book.associate?.()
Genre.associate?.()

export { User, Author, Book, Genre }
