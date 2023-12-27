import User from "../models/userModel";
import validationFromatter from "../utils/validationFromatter";
import validation from "../models/validations/userValidation";
import { pick, extend } from "lodash";
import errorHandler from "./errorHandler";

// Get All users
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password -__v");

    res.status(200).json({
      status: "success",
      users,
    });
  } catch (err) {
    return res.status(400).send({
      status: "errors",
      errors: err,
    });
  }
};

// Get User By Id
const getUserById = async (req, res, next) => {
  const user = await User.findById(req.params.userId);

  if (!user)
    return res.status("400").json({
      status: "error",
      message: "User not found",
    });

  req.user = user;
  next();
};

// Get User
const getUser = async (req, res, next) => {
  const user = req.user;

  res.status(200).json({
    status: "success",
    user: pick(user, [
      "_id",
      "name",
      "email",
      "educator",
      "createdAt",
      "updatedAt",
    ]),
  });
};

// Update User
const updateUser = async (req, res, next) => {
  try {
    let filterBody = pick(req.body, ["name", "email", "educator"]);

    const { error } = validation.updateUser(filterBody);

    if (error) {
      const errors = validationFromatter.joiError(error);
      return res.status(400).json({
        status: "error",
        errors,
      });
    }

    let user = extend(req.user, filterBody);
    await user.save();

    res.status(200).json({
      status: "success",
      user: pick(user, [
        "_id",
        "name",
        "email",
        "educator",
        "createdAt",
        "updatedAt",
      ]),
    });
  } catch (err) {
    res.status(400).json({
      status: "error",
      errors: errorHandler.getErrorMessage(err),
    });
  }
};

// Delete User
const deleteUser = async (req, res, next) => {
  const deletedUser = await req.user.remove();

  res.json({
    status: "success",
    user: pick(deletedUser, [
      "_id",
      "name",
      "email",
      "educator",
      "createdAt",
      "updatedAt",
    ]),
    message: "User deleted successfully",
  });
};

const isEducator = (req, res, next) => {
  const isEducator = req.user && req.user.educator;
  if (!isEducator) {
    return res.status("403").json({
      error: "User is not an educator",
    });
  }
  next();
};

export default {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserById,
  isEducator,
};
