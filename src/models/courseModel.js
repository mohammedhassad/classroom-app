import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
  },
  content: {
    type: String,
    required: [true, "Content is required"],
    trim: true,
  },
  resourceUrl: {
    type: String,
    required: [true, "resourceUrl is required"],
    trim: true,
  },
});

const lesson = mongoose.model("Lesson", lessonSchema);

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
    },
    image: {
      data: Buffer,
      contentType: String,
    },
    description: {
      type: String,
      trim: true,
      required: [true, "Description is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    published: {
      type: Boolean,
      default: false,
    },
    lessons: [lessonSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Course", courseSchema);
