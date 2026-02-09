import admin from '../firebaseAdmin'
import { Request, Response, NextFunction } from "express";

export async function authMiddleware (req: Request, res: Response, next: NextFunction){
    try {
        // header in format: "Bearer <token>"
        const token = req.headers.authorization?.split(" ")[1]

        if (!token || Array.isArray(token)) {
            return res.status(401).json({ error: "Invalid authorization header" });
        } 

        await admin.auth().verifyIdToken(token)
        
        next();

    } catch (err) {
        console.error("Token verification failed:", err);
        res.status(401).json({ error: "Unauthorized" });
    }
}