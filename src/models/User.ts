import { DataTypes, Model, Optional } from "sequelize"
import sequelize from "../config/database"

interface UserAttributes {
	id: number
	name: string
	username: string
	email: string
	password: string
	role: "customer" | "admin" | "author" | "moderator"
	active: boolean
	lastLogin?: Date | null
	lastIp?: string | null
	profilePicture?: string | null
	phone?: string | null
	address?: string | null
	dob?: string | null //date of birth
	emailVerified?: boolean | false
	twoFactorEnabled?: boolean | false
	createdAt?: Date
	updatedAt?: Date
	deletedAt?: Date | null
}

interface UserCreationAttributes extends Optional<UserAttributes, "id" | "lastLogin" | "lastIp" | "createdAt" | "updatedAt" | "deletedAt"> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
	public id!: number
	public name!: string
	public email!: string
	public username!: string
	public password!: string
	public role!: "customer" | "admin" | "author" | "moderator"
	public active!: boolean
	public lastLogin!: Date | null
	public lastIp!: string | null

	public profilePicture!: string | null
	public phone!: string | null
	public address!: string | null
	public dob!: string | null
	public emailVerified!: boolean | false
	public twoFactorEnabled!: boolean | false

	public readonly createdAt!: Date
	public readonly updatedAt!: Date
	public readonly deletedAt!: Date | null
}

User.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		username: {
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
			type: DataTypes.ENUM("customer", "admin", "author", "moderator"),
			allowNull: false,
			defaultValue: "customer"
		},
		active: {
			type: DataTypes.BOOLEAN,
			defaultValue: true
		},
		lastLogin: {
			type: DataTypes.DATE,
			allowNull: true
		},
		lastIp: {
			type: DataTypes.STRING,
			allowNull: true
		},
		profilePicture: {
			type: DataTypes.STRING,
			allowNull: true
		},
		phone: {
			type: DataTypes.STRING,
			allowNull: true
		},
		address: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		dob: {
			type: DataTypes.DATEONLY,
			allowNull: true
		},
		emailVerified: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		},
		twoFactorEnabled: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		}
	},
	{
		sequelize,
		modelName: "User",
		tableName: "users",
		timestamps: true, // Automatically adds createdAt and updatedAt fields
		paranoid: true // Enables soft deletes (adds deletedAt field)
	}
)

export default User
