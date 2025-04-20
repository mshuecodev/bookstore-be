import { Genre } from "../models/Genre"

export const createGenre = async (genreData: any) => {
	try {
		const genre = await Genre.create(genreData)
		return genre
	} catch (error) {
		throw new Error(`Error creating genre: ${error}`)
	}
}

export const getAllGenres = async () => {
	try {
		const genres = await Genre.findAll()
		return genres
	} catch (error) {
		throw new Error(`Error fetching genres: ${error}`)
	}
}

export const getGenreById = async (id: number) => {
	try {
		const genre = await Genre.findByPk(id)
		if (!genre) {
			throw new Error(`Genre with id ${id} not found`)
		}
		return genre
	} catch (error) {
		throw new Error(`Error fetching genre: ${error}`)
	}
}

export const updateGenre = async (id: number, genreData: any) => {
	try {
		const genre = await Genre.findByPk(id)
		if (!genre) {
			throw new Error(`Genre with id ${id} not found`)
		}
		await genre.update(genreData)
		return genre
	} catch (error) {
		throw new Error(`Error updating genre: ${error}`)
	}
}

export const deleteGenre = async (id: number) => {
	try {
		const genre = await Genre.findByPk(id)
		if (!genre) {
			throw new Error(`Genre with id ${id} not found`)
		}
		await genre.destroy()
		return genre
	} catch (error) {
		throw new Error(`Error deleting genre: ${error}`)
	}
}
