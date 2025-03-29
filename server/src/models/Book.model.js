import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    description: {
      type: String,
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, 
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
        type: String,
        default: "",
    },
  },
  { timestamps: true }
);

export const Book = mongoose.model("Book", bookSchema);