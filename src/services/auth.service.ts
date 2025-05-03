import { User } from "../models"
import { RefreshToken } from "../models/RefreshToken" // Assuming you have a RefreshToken model
import bcrypt from "bcryptjs"
import { NotFoundError, ConflictError, ValidationError, AuthenticationError } from "../middlewares/error.middleware"
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt"

// Register a new user
export const registerUser = async (userData: { name: string; email: string; password: string }) => {
	const { name, email, password } = userData

	// Validate input
	if (!name || !email || !password) {
		throw new ValidationError("Name, email, and password are required")
	}

	// Check if the user already exists
	const existingUser = await User.findOne({ where: { email } })
	if (existingUser) {
		throw new ConflictError("User with this email already exists")
	}

	// Hash the password
	const hashedPassword = await bcrypt.hash(password, 10)

	// Create the new user
	const user = await User.create({
		name,
		email,
		password: hashedPassword,
		role: "customer", // Default role
		active: true,
		username: ""
	})

	// Generate tokens
	const accessToken = generateAccessToken({ id: user.id, email: user.email })
	const refreshToken = generateRefreshToken({ id: user.id, email: user.email })

	// Save the refresh token in the database
	const expiresAt = new Date()
	expiresAt.setDate(expiresAt.getDate() + 7) // 7 days expiration
	await RefreshToken.create({
		userId: user.id,
		token: await bcrypt.hash(refreshToken, 10), // Hash the refresh token before saving
		expiresAt
	})

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
}

// Login a user
export const loginUser = async (email: string, password: string) => {
	// Validate input
	if (!email || !password) {
		throw new ValidationError("Email and password are required")
	}

	// Find the user by email
	const user = await User.findOne({ where: { email } })
	if (!user) {
		throw new AuthenticationError("Invalid email or password")
	}

	// Verify the password
	const isPasswordValid = await bcrypt.compare(password, user.password)
	if (!isPasswordValid) {
		throw new AuthenticationError("Invalid email or password")
	}

	// Generate tokens
	const accessToken = generateAccessToken({ id: user.id, email: user.email })
	const refreshToken = generateRefreshToken({ id: user.id, email: user.email })

	// Save the refresh token in the database
	const expiresAt = new Date()
	expiresAt.setDate(expiresAt.getDate() + 7) // 7 days expiration
	await RefreshToken.create({
		userId: user.id,
		token: await bcrypt.hash(refreshToken, 10), // Hash the refresh token before saving
		expiresAt
	})

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
}

// Refresh access token
export const refreshAccessToken = async (refreshToken: string) => {
	try {
		// Verify the refresh token
		const decoded = verifyRefreshToken(refreshToken)
		if (typeof decoded !== "object" || !("id" in decoded)) {
			throw new AuthenticationError("Invalid refresh token")
		}

		// Find the user by ID
		const user = await User.findByPk(decoded.id)
		if (!user) {
			throw new NotFoundError("User not found")
		}

		// Find the refresh token in the database
		const storedToken = await RefreshToken.findOne({ where: { userId: user.id } })
		if (!storedToken) {
			throw new AuthenticationError("Refresh token not found")
		}

		// Verify the stored token
		const isValid = await bcrypt.compare(refreshToken, storedToken.token)
		if (!isValid) {
			throw new AuthenticationError("Invalid refresh token")
		}

		// Check if the token has expired
		if (new Date() > storedToken.expiresAt) {
			throw new AuthenticationError("Refresh token has expired")
		}

		// Generate a new access token
		const newAccessToken = generateAccessToken({ id: user.id, email: user.email })
		return { accessToken: newAccessToken }
	} catch (error) {
		throw new AuthenticationError("Token refresh failed")
	}
}

// Logout a user (invalidate refresh token)
export const logoutUser = async (userId: number) => {
	const user = await User.findByPk(userId)
	if (!user) {
		throw new NotFoundError("User not found")
	}

	// Delete all refresh tokens for the user
	await RefreshToken.destroy({ where: { userId } })
	return { message: "User logged out successfully" }
}
