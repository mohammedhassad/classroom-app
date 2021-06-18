import express from "express";
import enrollmentController from "../controllers/enrollmentController";
import authController from "../controllers/authController";
import courseController from "../controllers/courseController";

const router = express.Router();

router
  .route("/enrolled")
  .get(authController.protect, enrollmentController.listEnrolled);

router
  .route("/new/:courseId")
  .post(
    authController.protect,
    enrollmentController.findEnrollment,
    enrollmentController.create
  );

router.route("/stats/:courseId").get(enrollmentController.enrollmentStats);

router
  .route("/complete/:enrollmentId")
  .put(
    authController.protect,
    enrollmentController.isStudent,
    enrollmentController.complete
  );

router
  .route("/:enrollmentId")
  .get(
    authController.protect,
    enrollmentController.isStudent,
    enrollmentController.getEnrollment
  )
  .delete(
    authController.protect,
    enrollmentController.isStudent,
    enrollmentController.deleteEnrollment
  );

router.param("courseId", courseController.courseById);
router.param("enrollmentId", enrollmentController.enrollmentByID);

export default router;
