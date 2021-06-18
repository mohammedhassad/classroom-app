import Course from "../models/courseModel";
import formidable from "formidable";
import { pick, extend, map } from "lodash";
import errorHandler from "./errorHandler";
import fs from "fs";
import { promisify } from "util";
import validation from "../models/validations/courseValidation";
import validationFromatter from "../utils/validationFromatter";
// import defaultImage from "../../client/assets/images/default.png";

const readFile = promisify(fs.readFile);

// create new Course
const create = (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        status: "error",
        message: "Image could not be uploaded",
      });
    }

    let filterBody = pick(fields, ["name", "description", "category"]);

    // validation fields
    const { error } = validation.createCourse(filterBody);

    if (error) {
      const errors = validationFromatter.joiError(error);
      return res.status(400).json({
        status: "error",
        errors,
      });
    }

    let course = new Course(filterBody);
    course.instructor = req.user;

    if (files.image) {
      if (!files.image.type.startsWith("image")) {
        return res.status(400).json({
          status: "error",
          message: "Image could not be uploaded",
        });
      }

      course.image = {
        data: await readFile(files.image.path),
        contentType: files.image.type,
      };
    }
    try {
      course = await course.save();
      res.status(200).json({
        status: "success",
        course,
      });
    } catch (err) {
      return res.status(400).json({
        status: "error",
        messsage: errorHandler.getErrorMessage(err),
      });
    }
  });
};

// get Course By Id
const courseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.courseId).populate(
      "instructor",
      "_id name"
    );

    if (!course) {
      return res.status("400").json({
        status: "error",
        message: "Course not found",
      });
    }

    req.course = course;
    next();
  } catch (err) {
    return res.status(400).json({
      status: "error",
      messsage: errorHandler.getErrorMessage(err),
    });
  }
};

// get Course
const getCourse = async (req, res, next) => {
  const course = pick(req.course, [
    "_id",
    "name",
    "description",
    "category",
    "instructor",
    "published",
    "lessons",
  ]);

  res.status(200).json({
    status: "success",
    course,
  });
};

// Get Courses
const getCourses = async (req, res) => {
  try {
    let courses = await Course.find().select("name email updatedAt createdAt");

    res.status(200).json({
      status: "success",
      course,
    });
  } catch (err) {
    return res.status(400).json({
      status: "error",
      messsage: errorHandler.getErrorMessage(err),
    });
  }
};

// update course
const updateCourse = async (req, res, nest) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        status: "error",
        message: "Image could not be uploaded",
      });
    }

    let course = extend(req.course, fields);
    if (fields.lessons) {
      course.lessons = JSON.parse(fields.lessons);
    }

    // validation fields
    let filterBody = pick(course, ["name", "description", "category"]);

    // Filter lessons to validate
    filterBody.lessons = map(course.lessons, (lesson) =>
      pick(lesson, ["title", "content", "resourceUrl"])
    );

    const { error } = validation.updateCourse(filterBody);

    if (error) {
      const errors = validationFromatter.joiError(error);
      return res.status(400).json({
        status: "error",
        errors,
      });
    }

    if (files.image) {
      if (!files.image.type.startsWith("image")) {
        return res.status(400).json({
          status: "error",
          message: "Image could not be uploaded",
        });
      }

      course.image = {
        data: await readFile(files.image.path),
        contentType: files.image.type,
      };
    }
    try {
      course = await course.save();
      res.status(200).json({
        status: "success",
        course,
      });
    } catch (err) {
      return res.status(400).json({
        status: "error",
        messsage: errorHandler.getErrorMessage(err),
      });
    }
  });
};

// delete Course
const deleteCourse = async (req, res, next) => {
  try {
    const deleteCourse = await req.course.remove();

    res.status(200).json({
      status: "success",
      deleteCourse,
    });
  } catch (err) {
    return res.status(400).json({
      status: "error",
      messsage: errorHandler.getErrorMessage(err),
    });
  }
};

// create new Lesson
const createLesson = async (req, res, next) => {
  try {
    let lesson = req.body.lesson;

    // validate lesson
    const { error } = validation.createLesson(lesson);

    if (error) {
      const errors = validationFromatter.joiError(error);
      return res.status(400).json({
        status: "error",
        errors,
      });
    }

    const result = await Course.findByIdAndUpdate(
      req.course._id,
      { $push: { lessons: lesson } },
      { new: true }
    ).populate("instructor", "_id name");

    res.status(200).json({
      status: "success",
      course: result,
    });
  } catch (err) {
    return res.status(400).json({
      status: "error",
      messsage: errorHandler.getErrorMessage(err),
    });
  }
};

// check instructor if it has permission
const isInstructor = (req, res, next) => {
  const isInstructor =
    req.course && req.auth && req.course.instructor._id == req.auth.id;

  if (!isInstructor) {
    return res.status("403").json({
      status: "error",
      message: "User is not authorized",
    });
  }

  next();
};

// lists Courses by Instructor
const listByInstructor = async (req, res, next) => {
  try {
    const courses = await Course.find({ instructor: req.user._id }).populate(
      "instructor",
      "_id name"
    );

    res.status(200).json({
      status: "success",
      courses,
    });
  } catch (err) {
    return res.status(400).json({
      status: "error",
      messsage: errorHandler.getErrorMessage(err),
    });
  }
};

// Lsts published courses
const listPublished = async (req, res, next) => {
  try {
    const courses = await Course.find({ published: true }).populate(
      "instructor",
      "_id name"
    );

    res.status(200).json({
      status: "success",
      courses,
    });
  } catch (err) {
    return res.status(400).json({
      status: "error",
      messsage: errorHandler.getErrorMessage(err),
    });
  }
};

// Get image
const photo = (req, res, next) => {
  if (req.course.image.data) {
    res.set("Content-Type", req.course.image.contentType);
    return res.send(req.course.image.data);
  }
  next();
};
const defaultPhoto = (req, res) => {
  // return res.sendFile(process.cwd() + defaultImage);
};

export default {
  create,
  listByInstructor,
  courseById,
  getCourse,
  isInstructor,
  createLesson,
  updateCourse,
  deleteCourse,
  listPublished,
  getCourses,
  photo,
  defaultPhoto,
};
