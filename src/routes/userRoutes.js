import express from "express";
import userController from "../controllers/userController";
import authController from "../controllers/authController";

const router = express.Router();

router.get("/", userController.getUsers);

router.use(authController.protect);

router
  .route("/:userId")
  .get(userController.getUser)
  .put(authController.hasAuthorization, userController.updateUser)
  .delete(authController.hasAuthorization, userController.deleteUser);

router.param("userId", userController.getUserById);

export default router;
