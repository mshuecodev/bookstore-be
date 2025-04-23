import { Author, Book } from "../models"

export const createAuthor = async (authorData: any) => {
	try {
		const author = await Author.create(authorData)
		return author
	} catch (error: any) {
		throw new Error(`Error creating author: ${error.message}`)
	}
}

export const updateAuthor = async (id: number, authorData: any) => {
	try {
		const author = await Author.findByPk(id)
		if (!author) {
			throw new Error("Author not found")
		}

		await author.update(authorData)
		return author
	} catch (error: any) {
		throw new Error(`Error updating author: ${error.message}`)
	}
}

// Get all authors
export const getAllAuthors = async () => {
	try {
		const authors = await Author.findAll({
			include: [{ model: Book, as: "books" }] // Include associated books
		})
		return authors
	} catch (error: any) {
		throw new Error(`Error fetching authors: ${error.message}`)
	}
}

// Get a specific author by ID
export const getAuthorById = async (id: number) => {
	try {
		const author = await Author.findByPk(id, {
			include: [{ model: Book, as: "books" }] // Include associated books
		})
		if (!author) {
			throw new Error("Author not found")
		}
		return author
	} catch (error: any) {
		throw new Error(`Error fetching author: ${error.message}`)
	}
}

export const deleteAuthor = async (id: number) => {
	try {
		const author = await Author.findByPk(id)
		if (!author) {
			throw new Error("Author not found")
		}
		await author.destroy()
		// return author
		return { message: "Author deleted successfully" }
	} catch (error: any) {
		throw new Error(`Error deleting author: ${error.message}`)
	}
}

export const addBooksToAuthor = async (authorId: number, bookIds: number[]) => {
	try {
		const author = await Author.findByPk(authorId)
		if (!author) {
			throw new Error("Author not found")
		}
		const books = await Book.findAll({
			where: {
				id: bookIds
			}
		})
		await author.addBooks(books)
		return author
	} catch (error: any) {
		throw new Error(`Error adding books to author: ${error.message}`)
	}
}

export const removeBooksFromAuthor = async (authorId: number, bookIds: number[]) => {
	try {
		const author = await Author.findByPk(authorId)
		if (!author) {
			throw new Error("Author not found")
		}
		const books = await Book.findAll({
			where: {
				id: bookIds
			}
		})
		await author.removeBooks(books)
		return author
	} catch (error: any) {
		throw new Error(`Error removing books from author: ${error.message}`)
	}
}
