import { Request, Response, NextFunction } from "express"

export class AppError extends Error {
	public statusCode: number | undefined

	constructor(message: string, statusCode?: number) {
		super(message)
		this.statusCode = statusCode
		Error.captureStackTrace(this, this.constructor)
	}
}

// Specific error classes for common error types
export class ValidationError extends AppError {
	constructor(message: string) {
		super(message, 400) // 400 Bad Request
	}
}

export class AuthenticationError extends AppError {
	constructor(message: string) {
		super(message, 401) // 401 Unauthorized
	}
}

export class NotFoundError extends AppError {
	constructor(message: string) {
		super(message, 404) // 404 Not Found
	}
}

export class ConflictError extends AppError {
	constructor(message: string) {
		super(message, 409) // 409 Conflict
	}
}

// Centralized error-handling middleware
export const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
	const statusCode = err.statusCode || 500
	const message = err.message || "Internal Server Error"

	// Log the error (use a logging library like Winston in production)
	console.error(`[Error] ${statusCode}: ${message}`)

	// Send a structured error response
	res.status(statusCode).json({
		status: "error",
		statusCode,
		message
	})
}

// Middleware for handling 404 errors
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
	res.status(404).json({
		status: "error",
		statusCode: 404,
		message: "Resource not found"
	})
}
