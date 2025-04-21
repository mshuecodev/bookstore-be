import { Book, Author, Genre } from "../models"

export const createBook = async (bookData: any) => {
	const { authorIds, genreIds, ...rest } = bookData
	try {
		const book = await Book.create(rest)

		if (authorIds && authorIds.length > 0) {
			const authors = await Author.findAll({
				where: {
					id: authorIds
				}
			})
			await book.addAuthors(authors)
		}

		if (genreIds && genreIds.length > 0) {
			const genres = await Genre.findAll({
				where: {
					id: genreIds
				}
			})
			await book.addGenres(genres)
		}
		return book
	} catch (error) {
		throw new Error(`Error creating book: ${error}`)
	}
}

export const updateBook = async (id: number, bookData: any) => {
	const { authorIds, genreIds, ...rest } = bookData
	try {
		const book = await Book.findByPk(id)
		if (!book) {
			throw new Error("Book not found")
		}

		await book.update(rest)

		if (authorIds && authorIds.length > 0) {
			const authors = await Author.findAll({
				where: {
					id: authorIds
				}
			})
			await book.setAuthors(authors)
		}

		if (genreIds && genreIds.length > 0) {
			const genres = await Genre.findAll({
				where: {
					id: genreIds
				}
			})
			await book.setGenres(genres)
		}

		return book
	} catch (error) {
		throw new Error(`Error updating book: ${error}`)
	}
}

export const getAllBooks = async () => {
	try {
		const books = await Book.findAll({
			include: [
				{
					model: Author,
					as: "authors"
				},
				{
					model: Genre,
					as: "genres"
				}
			]
		})
		return books
	} catch (error) {
		throw new Error(`Error fetching books: ${error}`)
	}
}

export const getBookById = async (id: number) => {
	try {
		const book = await Book.findByPk(id, {
			include: [
				{
					model: Author,
					as: "authors"
				},
				{
					model: Genre,
					as: "genres"
				}
			]
		})
		if (!book) {
			throw new Error("Book not found")
		}
		return book
	} catch (error) {
		throw new Error(`Error fetching book: ${error}`)
	}
}

export const getBookbyAuthorId = async (authorId: number) => {
	try {
		const books = await Book.findAll({
			include: [
				{
					model: Author,
					as: "authors",
					where: {
						id: authorId
					}
				}
			]
		})
		if (!books) {
			throw new Error("Books not found")
		}
		return books
	} catch (error) {
		throw new Error(`Error fetching books by author: ${error}`)
	}
}

export const deleteBook = async (id: number) => {
	const book = await Book.findByPk(id)
	if (!book) {
		throw new Error("Book not found")
	}
	try {
		await book.destroy()
		return { message: "Book deleted successfully" }
	} catch (error) {
		throw new Error(`Error deleting book: ${error}`)
	}
}
