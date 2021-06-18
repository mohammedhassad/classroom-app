import Enrollment from "../models/enrollmentModel";
import errorHandler from "./errorHandler";
import { map } from "lodash";

// Create Enrollment
const create = async (req, res) => {
  let newEnrollment = {
    course: req.course,
    student: req.auth.id,
  };

  newEnrollment.lessonStatus = map(req.course.lessons, (lesson) => ({
    lesson: lesson,
    complete: false,
  }));

  try {
    const enrollment = await Enrollment.create(newEnrollment);

    return res.status(200).json({
      status: "success",
      enrollment: enrollment,
    });
  } catch (err) {
    return res.status(400).json({
      status: "error",
      message: errorHandler.getErrorMessage(err),
    });
  }
};

/**
 * Load enrollment and append to req.
 */
const enrollmentByID = async (req, res, next) => {
  try {
    let enrollment = await Enrollment.findById(req.params.enrollmentId)
      .populate({ path: "course", populate: { path: "instructor" } })
      .populate("student", "_id name");

    if (!enrollment)
      return res.status("400").json({
        status: "error",
        message: "Enrollment not found",
      });

    req.enrollment = enrollment;
    next();
  } catch (err) {
    return res.status("400").json({
      status: "error",
      message: "Could not retrieve enrollment",
    });
  }
};

// Get Enrollment
const getEnrollment = (req, res) => {
  return res.status(200).json({
    status: "success",
    enrollment: req.enrollment,
  });
};

// Complete Course
const complete = async (req, res) => {
  let updatedData = {};
  updatedData["lessonStatus.$.complete"] = req.body.complete;
  updatedData.updated = Date.now();

  if (req.body.courseCompleted)
    updatedData.completed = req.body.courseCompleted;

  try {
    let enrollment = await Enrollment.updateOne(
      { "lessonStatus._id": req.body.lessonStatusId },
      { $set: updatedData }
    );

    res.status(200).json({
      status: "success",
      enrollment: enrollment,
    });
  } catch (err) {
    return res.status(400).json({
      status: "error",
      message: errorHandler.getErrorMessage(err),
    });
  }
};

// Delete Enrollment
const deleteEnrollment = async (req, res) => {
  try {
    let enrollment = req.enrollment;
    let deletedEnrollment = await enrollment.remove();

    res.status(200).json({
      status: "success",
      enrollment: deletedEnrollment,
    });
  } catch (err) {
    return res.status(400).json({
      status: "error",
      message: errorHandler.getErrorMessage(err),
    });
  }
};

// Check user if is student
const isStudent = (req, res, next) => {
  const isStudent = req.auth && req.auth.id == req.enrollment.student._id;

  if (!isStudent) {
    return res.status("403").json({
      status: "error",
      message: "User is not enrolled",
    });
  }

  next();
};

// List Enrolled Course By Student
const listEnrolled = async (req, res) => {
  try {
    let enrollments = await Enrollment.find({ student: req.auth.id })
      .sort({ completed: 1 })
      .populate("course", "_id name category");

    res.json({
      status: "success",
      enrollments: enrollments,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: "error",
      message: errorHandler.getErrorMessage(err),
    });
  }
};

// Find Enrollment
const findEnrollment = async (req, res, next) => {
  try {
    let enrollments = await Enrollment.find({
      course: req.course._id,
      student: req.auth.id,
    });

    if (enrollments.length === 0) {
      next();
    } else {
      res.json({
        status: "success",
        enrollment: enrollments[0],
      });
    }
  } catch (err) {
    return res.status(400).json({
      status: "error",
      message: errorHandler.getErrorMessage(err),
    });
  }
};

// Enrollment stats
const enrollmentStats = async (req, res) => {
  try {
    let stats = {};
    stats.totalEnrolled = await Enrollment.find({
      course: req.course._id,
    }).countDocuments();

    stats.totalCompleted = await Enrollment.find({ course: req.course._id })
      .exists("completed", true)
      .countDocuments();

    res.status(200).json({
      status: "success",
      stats: stats,
    });
  } catch (err) {
    return res.status(400).json({
      status: "error",
      message: errorHandler.getErrorMessage(err),
    });
  }
};

export default {
  create,
  enrollmentByID,
  getEnrollment,
  deleteEnrollment,
  complete,
  isStudent,
  listEnrolled,
  findEnrollment,
  enrollmentStats,
};
