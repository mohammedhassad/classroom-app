import express from "express";
import authController from "../controllers/authController";
import courseController from "../controllers/courseController";
import userController from "../controllers/userController";

const router = express.Router();

router
  .route("/by/:userId")
  .post(
    authController.protect,
    authController.hasAuthorization,
    userController.isEducator,
    courseController.create
  )
  .get(
    authController.protect,
    authController.hasAuthorization,
    courseController.listByInstructor
  );

router.route("/published").get(courseController.listPublished);

router
  .route("/:courseId/lesson/create")
  .put(
    authController.protect,
    courseController.isInstructor,
    courseController.createLesson
  );

router
  .route("/photo/:courseId")
  .get(courseController.photo, courseController.defaultPhoto);

router
  .route("/:courseId")
  .get(courseController.getCourse)
  .put(
    authController.protect,
    courseController.isInstructor,
    courseController.updateCourse
  )
  .delete(
    authController.protect,
    courseController.isInstructor,
    courseController.deleteCourse
  );

router.param("userId", userController.getUserById);
router.param("courseId", courseController.courseById);

export default router;
