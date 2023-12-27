import mongoose from "mongoose";

const EnrollmentSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  updated: Date,
  enrolled: {
    type: Date,
    default: Date.now,
  },
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  lessonStatus: [
    {
      lesson: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson" },
      complete: Boolean,
    },
  ],
  completed: Date,
});

export default mongoose.model("Enrollment", EnrollmentSchema);
