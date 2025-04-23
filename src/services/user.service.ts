import { User } from "../models/User"
import bcrypt from "bcryptjs"
import { NotFoundError } from "../middlewares/error.middleware"

export const createUser = async (userData: any) => {
	try {
		const { password, ...rest } = userData
		const hashedPassword = await bcrypt.hash(password, 10)

		const user = await User.create({ ...rest, password: hashedPassword })
		return user
	} catch (error) {
		throw new Error(`Error creating user: ${error}`)
	}
}

export const getAllUsers = async () => {
	try {
		const users = await User.findAll()
		return users
	} catch (error) {
		throw new Error(`Error fetching users: ${error}`)
	}
}

export const getUserById = async (id: number) => {
	try {
		const user = await User.findByPk(id)
		if (!user) {
			throw new NotFoundError(`User with id ${id} not found`)
		}
		return user
	} catch (error) {
		throw new Error(`Error fetching user: ${error}`)
	}
}

export const updateUser = async (id: number, userData: any) => {
	try {
		const { password, ...rest } = userData
		const user = await User.findByPk(id)
		if (!user) {
			throw new NotFoundError(`User with id ${id} not found`)
		}

		const hashedPassword = password ? await bcrypt.hash(password, 10) : user.password
		await user.update({ ...rest, password: hashedPassword })
		return user
	} catch (error) {
		throw new Error(`Error updating user: ${error}`)
	}
}

export const deleteUser = async (id: number) => {
	try {
		const user = await User.findByPk(id)
		if (!user) {
			throw new NotFoundError(`User with id ${id} not found`)
		}
		await user.destroy()
		return user
	} catch (error) {
		throw new Error(`Error deleting user: ${error}`)
	}
}
