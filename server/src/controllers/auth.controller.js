import { User } from "../models/User.model.js"
import { generateToken } from "../utils/generateToken.js"

export const register = async (req, res) => {
    const { username, email, password } = req.body
    try {
        if (!username || !email || !password) {
            return res.status(400).json({ error: "All fields are required" })
        }

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" })
        }
        
        const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
        const newUser = new User({
            username,
            email,
            password,
            avatar
        })
        await newUser.save()

        const token = generateToken(newUser._id)

        return res.status(201).json({
            token,
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                avatar: newUser.avatar
            },
            message: "User created successfully"
        })
    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body
    try {
        if (!email || !password) {
            return res.status(400).json({ error: "Missing email or password" })
        }

        const user = await User.findOne({ email })
        if (!user) return res.status(404).json({ error: "User not found" })

        const isPasswordValid = await user.isPasswordValid(password)
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid credentials" })
        }

        const token = generateToken(user._id)

        return res.status(200).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar
            },
            message: "User login successfully"
        })
    } catch (error) {
        console.error("Error login user:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie("token")
        return res.status(200).json({ message: "User logged out successfully" })
    } catch (error) {
        console.error("Error logout user:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}