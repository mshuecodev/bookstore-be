import { Request, Response, NextFunction } from "express"

interface CustomError extends Error {
	status?: number
}

export const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
	const statusCode = err.status || 500
	const message = err.message || "Internal Server Error"

	res.status(statusCode).json({
		error: message
	})
}

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
	const error: CustomError = new Error(`Route ${req.originalUrl} Not Found`)
	error.status = 404
	next(error)
}
