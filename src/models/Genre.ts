import { DataTypes, Model, Optional } from "sequelize"
import sequelize from "../config/database"
import { Book } from "./Book"

interface GenreAttributes {
	id: number
	name: string
	description: string
	createdAt?: Date
	updatedAt?: Date
}

interface GenreCreationAttributes extends Optional<GenreAttributes, "id"> {}

export class Genre extends Model<GenreAttributes, GenreCreationAttributes> implements GenreAttributes {
	public id!: number // Note that the `null assertion` `!` is required in strict mode
	public name!: string
	public description!: string
	public readonly createdAt!: Date
	public readonly updatedAt!: Date

	// Associations
	public static associate() {
		Genre.belongsToMany(Book, {
			through: "BookGenres",
			foreignKey: "genreId",
			otherKey: "bookId",
			as: "books"
		})
	}
}

Genre.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		description: {
			type: DataTypes.STRING,
			allowNull: true
		}
	},
	{
		sequelize,
		tableName: "genres",
		timestamps: true
	}
)
