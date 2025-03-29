 import express from "express"
import { addBook, getAllBooks, getRecommendedBooks, deleteBook } from "../controllers/book.controller.js"
import { isAuthorized } from "../middlewares/auth.middleware.js"

 const router = express.Router()

router.post("/", isAuthorized, addBook)
router.get("/", isAuthorized, getAllBooks)
router.get("/recommended", isAuthorized, getRecommendedBooks)
router.delete("/:id", isAuthorized, deleteBook)


 export default router