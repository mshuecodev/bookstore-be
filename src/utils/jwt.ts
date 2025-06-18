import jwt, { JwtPayload, SignOptions } from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET || ""
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || "1h"
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || ""
const REFRESH_TOKEN_EXPIRATION = process.env.REFRESH_TOKEN_EXPIRATION || "30d"

// Generate an access token
export const generateAccessToken = (payload: object): string => {
	if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined")

	const options: SignOptions = { expiresIn: JWT_EXPIRATION as SignOptions["expiresIn"] }
	return jwt.sign(payload, JWT_SECRET, options)
}

// Generate a refresh token
export const generateRefreshToken = (payload: object): string => {
	if (!REFRESH_TOKEN_SECRET) throw new Error("REFRESH_TOKEN_SECRET is not defined")

	const options: SignOptions = { expiresIn: REFRESH_TOKEN_EXPIRATION as SignOptions["expiresIn"] }
	return jwt.sign(payload, REFRESH_TOKEN_SECRET, options)
}

// Verify an access token
export const verifyAccessToken = (token: string): JwtPayload | string => {
	if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined")

	try {
		const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload
		return decoded
	} catch (error: any) {
		throw new Error("Invalid or expired access token")
	}
}

// Verify a refresh token
export const verifyRefreshToken = (token: string): JwtPayload | string => {
	if (!REFRESH_TOKEN_SECRET) throw new Error("REFRESH_TOKEN_SECRET is not defined")

	try {
		const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET) as JwtPayload
		return decoded
	} catch (error: any) {
		throw new Error("Invalid or expired refresh token")
	}
}

// Decode a token without verification (optional utility)
export const decodeToken = (token: string): JwtPayload | null => {
	try {
		return jwt.decode(token) as JwtPayload
	} catch {
		return null
	}
}

export const getTokenExpiryInSeconds = (token: string): number => {
	const decoded = jwt.decode(token) as JwtPayload
	if (!decoded || !decoded.exp) return 0
	const now = Math.floor(Date.now() / 1000)
	return Math.max(decoded.exp - now, 0)
}
