import cloudinary from "../configs/cloudinary.js"
import { Book } from "../models/Book.model.js"

export const addBook = async (req, res) => {
    const { title, description, rating, price, image } = req.body

    if (!title || !description || !rating || !price || !image) {
        return res.status(400).json({ error: "Missing required fields" })
    }

    try {
        const uploadedImage = await cloudinary.uploader.upload(image, {
            folder: "Bookstore"
        })
        const imageUrl = uploadedImage.secure_url;

        const newBook = new Book({
            title,
            description,
            rating,
            author: req.user._id,
            price,
            image: imageUrl
        })
        await newBook.save()
        return res.status(201).json({ newBook, message: "Book added successfully" });
    } catch (error) {
        console.error("Error adding book:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export const getAllBooks = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 5 
        const skip = (page - 1) * limit
        const books = await Book.find()
        .sort( { createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("author", "username email avatar")
        const totalBooks = await Book.countDocuments()
        const totalPages = Math.ceil(totalBooks / limit)

        return res.status(200).json({
            books,
            currentPage: page,
            totalBooks,
            totalPages,
        })
    } catch (error) {
        console.error("Error fetching books:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export const getRecommendedBooks = async (req, res) => {
    try {
        const books = await Book.find({ user: req.user._id })
        .sort({ rating: -1 })
        .limit(10)
        .populate("author", "username email avatar")
        return res.status(200).json(books)
    } catch (error) {
        console.error("Error fetching recommended books");
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export const deleteBook = async (req, res) => {
    try {
        const bookId = req.params.id
        const book = await Book.findById(bookId)
        if (!book) {
            return res.status(404).json({ error: "Book not found" })
        }

        if (book.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "You are not authorized to delete this book" })
        }

        try {
            const publicId = book.image.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(publicId)
        } catch (error) {
            console.error("Error deleting image from cloudinary:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        await book.deleteOne()
        return res.status(200).json({ message: "Book deleted successfully" })

    } catch (error) {
        console.error("Error deleting book:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}