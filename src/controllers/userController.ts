import { Request, Response } from "express"
import { getAllUsers, getUserById, updateUser, deleteUser } from "../services/userService"

export const getUsers = async (req: Request, res: Response) => {
	try {
		const users = await getAllUsers()
		res.status(200).json(users)
	} catch (error) {
		res.status(500).json({ message: "Error fetching users", error })
	}
}

export const getDetailUser = async (req: Request, res: Response) => {
	try {
		const userId = parseInt(req.params.id)
		const user = await getUserById(userId)
		if (user) {
			res.status(200).json(user)
		} else {
			res.status(404).json({ message: "User not found" })
		}
	} catch (error) {
		res.status(500).json({ message: "Error fetching user", error })
	}
}

export const updateUserDetails = async (req: Request, res: Response) => {
	try {
		const userId = parseInt(req.params.id)
		const userData = req.body
		const updatedUser = await updateUser(userId, userData)
		if (updatedUser) {
			res.status(200).json(updatedUser)
		} else {
			res.status(404).json({ message: "User not found" })
		}
	} catch (error) {
		res.status(500).json({ message: "Error updating user", error })
	}
}

export const deleteUserById = async (req: Request, res: Response) => {
	try {
		const userId = parseInt(req.params.id)
		const deleted = await deleteUser(userId)
		if (deleted) {
			res.status(200).json({ message: "User deleted successfully" })
		} else {
			res.status(404).json({ message: "User not found" })
		}
	} catch (error) {
		res.status(500).json({ message: "Error deleting user", error })
	}
}
