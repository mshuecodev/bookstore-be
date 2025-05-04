import { Request, Response, NextFunction } from "express"
import { registerUser, loginUser, refreshAccessToken, logoutUser, generateResetToken, resetPassword } from "../services/auth.service"

// Register a new user
export const registerController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { name, email, password } = req.body

		// Validate input
		if (!name || !email || !password) {
			res.status(400).json({ message: "Name, email, and password are required" })
			return
		}

		const result = await registerUser({ name, email, password })
		res.status(201).json(result)
	} catch (error: any) {
		next(error) // Pass the error to the centralized error handler
	}
}

// Login a user
export const loginController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { email, password } = req.body

		// Validate input
		if (!email || !password) {
			res.status(400).json({ message: "Email and password are required" })
			return
		}

		const { accessToken, refreshToken, user } = await loginUser(email, password)

		res.status(200).json({
			accessToken,
			refreshToken,
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
				role: user.role
			}
		})
	} catch (error: any) {
		next(error) // Pass the error to the centralized error handler
	}
}

// Refresh access token
export const refreshController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { refreshToken } = req.body

		// Validate input
		if (!refreshToken) {
			res.status(400).json({ message: "Refresh token is required" })
			return
		}

		const { accessToken } = await refreshAccessToken(refreshToken)
		res.status(200).json({ accessToken })
	} catch (error: any) {
		next(error) // Pass the error to the centralized error handler
	}
}

// Logout a user
export const logoutController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { userId } = req.body

		// Validate input
		if (!userId) {
			res.status(400).json({ message: "User ID is required" })
			return
		}

		const result = await logoutUser(userId)
		res.status(200).json(result)
	} catch (error: any) {
		next(error) // Pass the error to the centralized error handler
	}
}

export const requestPasswordResetController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { email } = req.body

		if (!email) {
			res.status(400).json({ message: "Email is required" })
			return
		}

		const resetToken = await generateResetToken(email)

		// Send the reset token via email (use a real email service in production)
		console.log(`Password reset token for ${email}: ${resetToken}`)

		res.status(200).json({ message: "Password reset email sent" })
	} catch (error: any) {
		next(error)
	}
}

export const resetPasswordController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { token, newPassword } = req.body

		if (!token || !newPassword) {
			res.status(400).json({ message: "Token and new password are required" })
			return
		}

		const result = await resetPassword(token, newPassword)
		res.status(200).json(result)
	} catch (error: any) {
		next(error)
	}
}
