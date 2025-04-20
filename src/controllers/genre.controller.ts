import { Request, Response } from "express"
import { createGenre, getAllGenres, getGenreById, updateGenre, deleteGenre } from "../services/genre.service"

export const createGenreController = async (req: Request, res: Response) => {
	try {
		const genreData = req.body
		const genre = await createGenre(genreData)
		res.status(201).json(genre)
	} catch (error: any) {
		res.status(500).json({ message: error.message })
	}
}

export const getAllGenresController = async (req: Request, res: Response) => {
	try {
		const genres = await getAllGenres()
		res.status(200).json(genres)
	} catch (error: any) {
		res.status(500).json({ message: error.message })
	}
}

export const getGenreByIdController = async (req: Request, res: Response) => {
	try {
		const genreId = parseInt(req.params.id)
		const genre = await getGenreById(genreId)
		res.status(200).json(genre)
	} catch (error: any) {
		res.status(500).json({ message: error.message })
	}
}

export const updateGenreController = async (req: Request, res: Response) => {
	try {
		const genreId = parseInt(req.params.id)
		const genreData = req.body
		const updatedGenre = await updateGenre(genreId, genreData)
		res.status(200).json(updatedGenre)
	} catch (error: any) {
		res.status(500).json({ message: error.message })
	}
}

export const deleteGenreController = async (req: Request, res: Response) => {
	try {
		const genreId = parseInt(req.params.id)
		const deletedGenre = await deleteGenre(genreId)
		res.status(200).json(deletedGenre)
	} catch (error: any) {
		res.status(500).json({ message: error.message })
	}
}
