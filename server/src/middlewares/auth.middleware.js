import jwt from "jsonwebtoken"
import { User } from "../models/User.model.js"

export const isAuthorized = async (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "")

        if (!token) return res.status(401).json({ error: "No authorization token. Access denied." })

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findById(decoded.id).select("-password")
        if (!user) return res.status(404).json({ error: "User not found. Invalid token." })
             
        req.user = user
        next();
        
    } catch (error) {
        console.error("Authorization error :", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
     
}