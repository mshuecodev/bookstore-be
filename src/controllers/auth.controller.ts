import { Request, Response, NextFunction } from "express"
import { registerUser, loginUser, refreshAccessToken } from "../services/auth.service"

export const registerController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { name, email, password } = req.body

		const result = await registerUser({ name, email, password })
		res.status(201).json(result)
	} catch (error: any) {
		next(error) // Pass the error to the centralized error handler
	}
}

export const loginController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { email, password } = req.body
		if (!email || !password) {
			res.status(400).json({ message: "All fields are required" })
		} else {
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
		}
	} catch (error: any) {
		next(error) // Pass the error to the centralized error handler
	}
}

export const refreshController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { refreshToken } = req.body
		if (!refreshToken) {
			res.status(400).json({ message: "Refresh token is required" })
		} else {
			const { accessToken } = await refreshAccessToken(refreshToken)
			res.status(200).json({ accessToken })
		}
	} catch (error: any) {
		next(error) // Pass the error to the centralized error handler
	}
}
