import { DataTypes, Model } from "sequelize"
import sequelize from "../config/database"
import { User } from "./User"
import { Genre } from "./Genre"

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

	public addAuthors!: (authors: User[]) => Promise<void>
	public addGenres!: (genres: Genre[]) => Promise<void>
	public setAuthors!: (authors: User[]) => Promise<void>
	public setGenres!: (genres: Genre[]) => Promise<void>

	public static associate() {
		Book.belongsToMany(User, {
			through: "BookAuthors",
			foreignKey: "bookId",
			otherKey: "userId",
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
		modelName: "book"
	}
)
