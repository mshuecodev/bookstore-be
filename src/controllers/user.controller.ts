import { Request, Response, NextFunction } from "express"
import { createUser, getAllUsers, getUserById, updateUser, deleteUser } from "../services/user.service"

export const createUserController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const userData = req.body
		const user = await createUser(userData)
		res.status(201).json(user)
	} catch (error: any) {
		next(error) // Pass the error to the centralized error handler
	}
}

export const getAllUsersController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const users = await getAllUsers()
		res.status(200).json(users)
	} catch (error: any) {
		next(error) // Pass the error to the centralized error handler
	}
}

export const getUserByIdController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const userId = parseInt(req.params.id)
		const user = await getUserById(userId)
		res.status(200).json(user)
	} catch (error: any) {
		next(error) // Pass the error to the centralized error handler
	}
}

export const updateUserController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const userId = parseInt(req.params.id)
		const userData = req.body
		const updatedUser = await updateUser(userId, userData)
		res.status(200).json(updatedUser)
	} catch (error: any) {
		next(error) // Pass the error to the centralized error handler
	}
}

export const deleteUserController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const userId = parseInt(req.params.id)
		const deletedUser = await deleteUser(userId)
		res.status(200).json(deletedUser)
	} catch (error: any) {
		next(error) // Pass the error to the centralized error handler
	}
}
