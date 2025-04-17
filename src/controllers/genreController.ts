import { Request, Response } from "express"
import { getAllGenres, createGenre, getGenreById, updateGenre, deleteGenre } from "../services/genreService"

export const addGenre = async (req: Request, res: Response) => {
	try {
		const genre = req.body
		const newGenre = await createGenre(genre)
		res.status(201).json(newGenre)
	} catch (error) {
		res.status(500).json({ message: "Error adding genre", error })
	}
}

export const getGenres = async (req: Request, res: Response) => {
	try {
		const genres = await getAllGenres()
		res.status(200).json(genres)
	} catch (error) {
		res.status(500).json({ message: "Error fetching genres", error })
	}
}

export const getDetailGenre = async (req: Request, res: Response) => {
	try {
		const genreId = parseInt(req.params.id)
		const genre = await getGenreById(genreId)
		if (genre) {
			res.status(200).json(genre)
		} else {
			res.status(404).json({ message: "Genre not found" })
		}
	} catch (error) {
		res.status(500).json({ message: "Error fetching genre", error })
	}
}

export const updateGenrebyID = async (req: Request, res: Response) => {
	try {
		const genreId = parseInt(req.params.id)
		const genreData = req.body
		const updatedGenre = await updateGenre(genreId, genreData)
		if (updatedGenre) {
			res.status(200).json(updatedGenre)
		} else {
			res.status(404).json({ message: "Genre not found" })
		}
	} catch (error) {
		res.status(500).json({ message: "Error updating genre", error })
	}
}

export const deleteGenreById = async (req: Request, res: Response) => {
	try {
		const genreId = parseInt(req.params.id)
		const deleted = await deleteGenre(genreId)
		if (deleted) {
			res.status(200).json({ message: "Genre deleted successfully" })
		} else {
			res.status(404).json({ message: "Genre not found" })
		}
	} catch (error) {
		res.status(500).json({ message: "Error deleting genre", error })
	}
}
