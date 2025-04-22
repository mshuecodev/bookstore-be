import { DataTypes, Model } from "sequelize"
import sequelize from "../config/database"
import { Book } from "./Book"

export class User extends Model {
	public id!: number // Note that the `null assertion` `!` is required in strict mode
	public name!: string
	public email!: string
	public password!: string
	public role!: string
	public readonly createdAt!: Date
	public readonly updatedAt!: Date
	public readonly deletedAt!: Date
	public active!: boolean
	public lastLogin!: Date
	public lastIp!: string
}

User.init(
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
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false
		},
		role: {
			type: DataTypes.STRING,
			allowNull: false
		},
		active: {
			type: DataTypes.BOOLEAN,
			defaultValue: true
		},
		lastLogin: {
			type: DataTypes.DATE
		},
		lastIp: {
			type: DataTypes.STRING
		}
	},
	{
		sequelize,
		modelName: "users",
		tableName: "users"
	}
)
