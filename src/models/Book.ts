import { DataTypes, Model } from "sequelize"
import sequelize from "../config/database"
import { Author, Genre } from "./index"

export class Book extends Model {
	public id!: number // Note that the `null assertion` `!` is required in strict mode
	public title!: string
	public publicationDate!: Date
	public summary!: string
	public coverImage!: string
	public rating!: number
	public reviews!: number
	public price!: number
	public stock!: number
	public readonly createdAt!: Date
	public readonly updatedAt!: Date

	public addAuthors!: (authors: Author[]) => Promise<void>
	public addGenres!: (genres: Genre[]) => Promise<void>
	public setAuthors!: (authors: Author[]) => Promise<void>
	public setGenres!: (genres: Genre[]) => Promise<void>

	public static associate() {
		// Many-to-Many: A Book can have many Authors
		Book.belongsToMany(Author, {
			through: "BookAuthors", // Junction table
			foreignKey: "bookId",
			otherKey: "authorId",
			as: "authors"
		})
		Book.belongsToMany(Genre, {
			through: "BookGenres",
			foreignKey: "bookId",
			otherKey: "genreId",
			as: "genres"
		})
	}
}

Book.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false
		},
		summary: {
			type: DataTypes.STRING,
			allowNull: true
		},
		price: {
			type: DataTypes.FLOAT,
			allowNull: false
		},
		stock: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		publicationDate: {
			type: DataTypes.DATE,
			allowNull: true
		},
		coverImage: {
			type: DataTypes.STRING,
			allowNull: true
		}
	},
	{
		sequelize,
		modelName: "book",
		tableName: "books"
	}
)
