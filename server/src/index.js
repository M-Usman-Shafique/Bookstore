import express from "express"
import "dotenv/config"
import connectDB from "./configs/mongodb.js"
import authRoutes from "./routes/authRoutes.js"
import bookRoutes from "./routes/bookRoutes.js"

const app = express();
const port = process.env.PORT || 8000
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/books", bookRoutes)
app.get("/", (req, res) => {
    res.send("Welcome to the Bookstore server!")
} )

connectDB()
  .then(async () => {
    app.listen(port, () => {
      console.log(`Server is running on ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });