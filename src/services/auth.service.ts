import { User } from "../models"
import { RefreshToken } from "../models/RefreshToken" // Assuming you have a RefreshToken model
import bcrypt from "bcryptjs"
import { NotFoundError, ConflictError, ValidationError, AuthenticationError } from "../middlewares/error.middleware"
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt"
import { Op } from "sequelize"
import crypto from "crypto"

// Register a new user
export const registerUser = async (userData: { name: string; email: string; password: string; role: "customer" | "admin" | "author" | "moderator" }) => {
	const { name, email, password, role } = userData

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

	const userRole = role || "customer"

	// Create the new user
	const user = await User.create({
		name,
		email,
		password: hashedPassword,
		role: userRole, // Default role
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

export const generateResetToken = async (email: string) => {
	// Find the user by email
	const user = await User.findOne({ where: { email } })
	if (!user) {
		throw new Error("User not found")
	}

	// Generate a secure random token
	const resetToken = crypto.randomBytes(32).toString("hex")

	// Hash the token before saving it to the database
	const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex")

	// Set the reset token and expiration time (e.g., 1 hour)
	const expiresAt = new Date()
	expiresAt.setHours(expiresAt.getHours() + 1)

	await user.update({
		resetPasswordToken: hashedToken,
		resetPasswordExpires: expiresAt
	})

	return resetToken // Return the plain token to send via email
}

export const validateResetToken = async (token: string) => {
	// Hash the token to compare with the stored hashed token
	const hashedToken = crypto.createHash("sha256").update(token).digest("hex")

	// Find the user with the matching reset token and check expiration
	const user = await User.findOne({
		where: {
			resetPasswordToken: hashedToken,
			resetPasswordExpires: { [Op.gt]: new Date() } // Ensure the token is not expired
		}
	})

	if (!user) {
		throw new Error("Invalid or expired reset token")
	}

	return user
}

export const resetPassword = async (token: string, newPassword: string) => {
	// Validate the reset token
	const user = await validateResetToken(token)

	// Hash the new password
	const hashedPassword = await bcrypt.hash(newPassword, 10)

	// Update the user's password and clear the reset token
	await user.update({
		password: hashedPassword,
		resetPasswordToken: null,
		resetPasswordExpires: null
	})

	return { message: "Password reset successfully" }
}
