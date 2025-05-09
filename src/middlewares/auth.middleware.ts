import { Request, Response, NextFunction } from "express"
import { verifyAccessToken } from "../utils/jwt"

// Extend the Request interface to include the user property
declare global {
	namespace Express {
		interface Request {
			user?: any
		}
	}
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers["authorization"]

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		res.status(401).json({ message: "Unauthorized" })
	} else {
		const token = authHeader.split(" ")[1]

		try {
			const decoded = verifyAccessToken(token)
			req.user = decoded // Attach the user information to the request object
			next()
		} catch (error) {
			res.status(401).json({ message: "Unauthorized" })
		}
	}
}

export const authorize = (roles: string[]) => {
	return (req: Request, res: Response, next: NextFunction) => {
		if (!req.user || !roles.includes(req.user.role)) {
			res.status(403).json({ message: "Forbidden" })
		} else {
			next()
		}
	}
}
