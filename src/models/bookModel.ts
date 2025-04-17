import { Genre } from "./genreModel"

export interface Book {
	id: number
	title: string
	description: string
	author: string
	genre: string
	publishedDate: string
	summary: string
	coverImage: string
	rating: number
	reviews: number
	price: number
	stock: number
	publisher: string
	author_id: number
	publisher_id: number
	genres?: Genre[]
}
