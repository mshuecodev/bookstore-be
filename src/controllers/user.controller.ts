import { Request, Response } from "express"
import { createUser, getAllUsers, getUserById, updateUser, deleteUser } from "../services/user.service"

export const createUserController = async (req: Request, res: Response) => {
	try {
		const userData = req.body
		const user = await createUser(userData)
		res.status(201).json(user)
	} catch (error: any) {
		res.status(500).json({ message: error.message })
	}
}

export const getAllUsersController = async (req: Request, res: Response) => {
	try {
		const users = await getAllUsers()
		res.status(200).json(users)
	} catch (error: any) {
		res.status(500).json({ message: error.message })
	}
}

export const getUserByIdController = async (req: Request, res: Response) => {
	try {
		const userId = parseInt(req.params.id)
		const user = await getUserById(userId)
		res.status(200).json(user)
	} catch (error: any) {
		res.status(500).json({ message: error.message })
	}
}

export const updateUserController = async (req: Request, res: Response) => {
	try {
		const userId = parseInt(req.params.id)
		const userData = req.body
		const updatedUser = await updateUser(userId, userData)
		res.status(200).json(updatedUser)
	} catch (error: any) {
		res.status(500).json({ message: error.message })
	}
}

export const deleteUserController = async (req: Request, res: Response) => {
	try {
		const userId = parseInt(req.params.id)
		const deletedUser = await deleteUser(userId)
		res.status(200).json(deletedUser)
	} catch (error: any) {
		res.status(500).json({ message: error.message })
	}
}
