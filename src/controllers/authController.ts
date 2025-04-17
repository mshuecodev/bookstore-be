import { Request, Response } from "express"
import { registerUser, loginUser } from "../services/authService"

export const registerUserCtrl = async (req: Request, res: Response) => {
	try {
		const { name, email, password, role } = req.body
		const user = await registerUser(name, email, password, role)
		res.status(201).json(user)
	} catch (error) {
		res.status(500).json({ message: "Error registering user", error })
	}
}

export const loginUserCtrl = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body
		const { token, user } = await loginUser(email, password)
		res.status(200).json({ token, user })
	} catch (error) {
		res.status(401).json({ message: "Invalid email or password", error })
	}
}
