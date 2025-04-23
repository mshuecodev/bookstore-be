import { User } from "../models"
import bcrypt from "bcryptjs"

import { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } from "../utils/jwt"

export const registerUser = async (userData: any) => {
	const { name, email, password } = userData
	const hashedPassword = await bcrypt.hash(password, 10)

	try {
		const user = await User.create({
			name,
			email,
			password: hashedPassword,
			role: "user",
			active: true
		})

		const accessToken = generateAccessToken({ id: user.id, email: user.email })
		const refreshToken = generateRefreshToken({ id: user.id, email: user.email })

		return { accessToken, refreshToken }
	} catch (error) {
		console.error("Error registering user:", error)
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
		console.error("Error logging in user:", error)
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

		if (!user) throw new Error("User not found")

		const newAccessToken = generateAccessToken({ id: user.id, email: user.email })
		return { accessToken: newAccessToken }
	} catch (error) {
		console.error("Error refreshing access token:", error)
		throw new Error("Token refresh failed")
	}
}
