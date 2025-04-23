import { Request, Response, NextFunction } from "express"
import { createGenre, getAllGenres, getGenreById, updateGenre, deleteGenre } from "../services/genre.service"

export const createGenreController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const genreData = req.body
		const genre = await createGenre(genreData)
		res.status(201).json(genre)
	} catch (error: any) {
		next(error) // Pass the error to the centralized error handler
	}
}

export const getAllGenresController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const genres = await getAllGenres()
		res.status(200).json(genres)
	} catch (error: any) {
		next(error) // Pass the error to the centralized error handler
	}
}

export const getGenreByIdController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const genreId = parseInt(req.params.id)
		const genre = await getGenreById(genreId)
		res.status(200).json(genre)
	} catch (error: any) {
		next(error) // Pass the error to the centralized error handler
	}
}

export const updateGenreController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const genreId = parseInt(req.params.id)
		const genreData = req.body
		const updatedGenre = await updateGenre(genreId, genreData)
		res.status(200).json(updatedGenre)
	} catch (error: any) {
		next(error) // Pass the error to the centralized error handler
	}
}

export const deleteGenreController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const genreId = parseInt(req.params.id)
		const deletedGenre = await deleteGenre(genreId)
		res.status(200).json(deletedGenre)
	} catch (error: any) {
		next(error) // Pass the error to the centralized error handler
	}
}
