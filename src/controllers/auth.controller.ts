import { Request, Response } from "express"
import { registerUser, loginUser, refreshAccessToken } from "../services/auth.service"

export const registerController = async (req: Request, res: Response) => {
	try {
		const { name, email, password } = req.body
		if (!name || !email || !password) {
			res.status(400).json({ message: "All fields are required" })
		} else {
			const user = await registerUser({ name, email, password })
			res.status(201).json(user)
		}
	} catch (error: any) {
		res.status(500).json({ message: "Internal server error" })
	}
}

export const loginController = async (req: Request, res: Response) => {
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
		res.status(500).json({ message: "Internal server error" })
	}
}

export const refreshController = async (req: Request, res: Response) => {
	try {
		const { refreshToken } = req.body
		if (!refreshToken) {
			res.status(400).json({ message: "Refresh token is required" })
		} else {
			const { accessToken } = await refreshAccessToken(refreshToken)
			res.status(200).json({ accessToken })
		}
	} catch (error: any) {
		res.status(500).json({ message: "Internal server error" })
	}
}
