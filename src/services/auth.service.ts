import { User } from "../models"
import bcrypt from "bcryptjs"
import { NotFoundError, ConflictError, ValidationError } from "../middlewares/error.middleware"

import { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } from "../utils/jwt"

export const registerUser = async (userData: any) => {
	const { name, email, password } = userData
	const hashedPassword = await bcrypt.hash(password, 10)

	try {
		// Check if the user already exists
		const existingUser = await User.findOne({ where: { email } })
		if (existingUser) {
			throw new ConflictError("User with this email already exists")
		}
		const user = await User.create({
			name,
			email,
			password: hashedPassword,
			role: "user",
			active: true
		})

		const accessToken = generateAccessToken({ id: user.id, email: user.email })
		const refreshToken = generateRefreshToken({ id: user.id, email: user.email })

		return {
			accessToken,
			refreshToken,
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
				role: user.role
			}
		}
	} catch (error) {
		throw new Error("User registration failed")
	}
}

export const loginUser = async (email: string, password: string) => {
	try {
		const user = await User.findOne({ where: { email } })
		if (!user) throw new Error("User not found")

		const isPasswordValid = await bcrypt.compare(password, user.password)
		if (!isPasswordValid) throw new Error("Invalid password")

		const accessToken = generateAccessToken({ id: user.id, email: user.email })
		const refreshToken = generateRefreshToken({ id: user.id, email: user.email })

		return { accessToken, refreshToken, user }
	} catch (error) {
		throw new Error("User login failed")
	}
}

export const refreshAccessToken = async (refreshToken: string) => {
	try {
		const decoded = verifyRefreshToken(refreshToken)
		if (typeof decoded !== "object" || !("id" in decoded)) {
			throw new Error("Invalid token payload")
		}
		const user = await User.findByPk(decoded.id)

		if (!user) {
			throw new NotFoundError("User not found")
		}

		const newAccessToken = generateAccessToken({ id: user.id, email: user.email })
		return { accessToken: newAccessToken }
	} catch (error) {
		throw new Error("Token refresh failed")
	}
}
