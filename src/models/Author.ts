import { DataTypes, Model, Optional } from "sequelize"
import sequelize from "../config/database"
import { Book } from "./Book"

interface AuthorAttributes {
	id: number
	name: string
	bio: string
}

interface AuthorCreationAttributes extends Optional<AuthorAttributes, "id"> {}

export class Author extends Model<AuthorAttributes, AuthorCreationAttributes> implements AuthorAttributes {
	public id!: number
	public name!: string
	public bio!: string

	public readonly createdAt!: Date
	public readonly updatedAt!: Date

	// Sequelize association methods for many-to-many relationships
	public addBooks!: (books: Book[] | Book) => Promise<void>
	public removeBooks!: (books: Book[] | Book) => Promise<void>
	public getBooks!: () => Promise<Book[]>

	// Associations
	public static associate() {
		// Many-to-Many: An Author can write many Books
		Author.belongsToMany(Book, {
			through: "BookAuthors", // Junction table
			foreignKey: "authorId",
			otherKey: "bookId",
			as: "books"
		})
	}
}

// Initialize the Author model
Author.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		name: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		bio: {
			type: DataTypes.TEXT,
			allowNull: true
		}
	},
	{
		sequelize,
		modelName: "author"
	}
)
