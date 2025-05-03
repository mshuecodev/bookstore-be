import { DataTypes, Model, Optional } from "sequelize"
import sequelize from "../config/database"

interface RefreshTokenAttributes {
	id: number
	userId: number
	token: string // The hashed refresh token
	expiresAt: Date // Expiration date for the token
	deviceInfo?: string | null // Optional: Device information (e.g., "Chrome on Windows")
	ipAddress?: string | null // Optional: IP address of the user
	createdAt?: Date
	updatedAt?: Date
}

interface RefreshTokenCreationAttributes extends Optional<RefreshTokenAttributes, "id" | "deviceInfo" | "ipAddress" | "createdAt" | "updatedAt"> {}

export class RefreshToken extends Model<RefreshTokenAttributes, RefreshTokenCreationAttributes> implements RefreshTokenAttributes {
	public id!: number
	public userId!: number
	public token!: string
	public expiresAt!: Date
	public deviceInfo!: string | null
	public ipAddress!: string | null

	public readonly createdAt!: Date
	public readonly updatedAt!: Date
}

RefreshToken.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		token: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		expiresAt: {
			type: DataTypes.DATE,
			allowNull: false
		},
		deviceInfo: {
			type: DataTypes.STRING,
			allowNull: true
		},
		ipAddress: {
			type: DataTypes.STRING,
			allowNull: true
		}
	},
	{
		sequelize,
		modelName: "RefreshToken",
		tableName: "refresh_tokens",
		timestamps: true // Automatically adds createdAt and updatedAt fields
	}
)

export default RefreshToken
