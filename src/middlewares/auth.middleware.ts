import { Request, Response, NextFunction } from "express"
import { verifyAccessToken } from "../utils/jwt"
import { blacklistedTokens } from "../services/auth.service"
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
		res.status(401).json({ message: "Authorization header is missing or invalid" })
	} else {
		const token = authHeader.split(" ")[1]

		if (blacklistedTokens.has(token)) {
			res.status(401).json({ message: "Token has been revoked" })
		} else {
			try {
				const decoded = verifyAccessToken(token)
				req.user = decoded // Attach the user information to the request object
				next()
			} catch (error: any) {
				if (error.name === "TokenExpiredError") {
					res.status(401).json({ message: "Token has expired" })
					return
				}
				res.status(401).json({ message: "Invalid token" })
			}
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
