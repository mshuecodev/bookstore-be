import { Request, Response, NextFunction } from "express"
import { verifyToken } from "../services/authService"

// Extend the Request interface to include the 'user' property
declare global {
	namespace Express {
		interface Request {
			user?: any
		}
	}
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
	const token = req.headers["authorization"]

	if (!token) {
		return next({ status: 401, message: "No token provided" })
	}

	try {
		const decoded = verifyToken(token)
		console.log("decoded", decoded)

		if (!decoded) {
			return next({ status: 401, message: "Invalid token" })
		}

		req.user = decoded
		next()
	} catch (error) {
		next({ status: 401, message: "Invalid token" })
	}
}

export const authorize = (roles: string[]) => {
	return (req: Request, res: Response, next: NextFunction) => {
		if (!req.user || !roles.includes(req.user.role)) {
			return next({ status: 403, message: "Access denied" })
		}
		next()
	}
}
