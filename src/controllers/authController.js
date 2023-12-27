import jwt from "jsonwebtoken";
import expressJwt from "express-jwt";
import { pick } from "lodash";
import User from "../models/userModel";
import validation from "../models/validations/authValidation";
import errorHandler from "./errorHandler";
import validationFromatter from "../utils/validationFromatter";
import config from "../config/config";

const signToken = (id) => {
  return jwt.sign({ id: id }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
};

const signup = async (req, res, next) => {
  const { error } = validation.signup(req.body);

  if (error) {
    const errors = validationFromatter.joiError(error);

    return res.status(400).json({
      status: "error",
      errors,
    });
  }

  try {
    const user = await User.create(
      pick(req.body, ["name", "email", "password"])
    );

    // send response
    res.status(201).json({
      status: "success",
      message: "User signup  successfully",
    });
  } catch (err) {
    return res.status(400).send({
      status: "error",
      errors: errorHandler.getErrorMessage(err),
    });
  }
};

const signin = async (req, res, next) => {
  const { error } = validation.signin(req.body);

  if (error) {
    const errors = validationFromatter.joiError(error);

    return res.status(400).json({
      status: "error",
      errors,
    });
  }

  try {
    const user = await User.findOne({ email: req.body.email }).select(
      "+password"
    );

    if (!user || !(await user.comparePassword(req.body.password))) {
      return res.status(401).json({
        status: "error",
        message: "Incorrect email or password",
      });
    }

    const token = signToken(user._id);

    res.status(200).json({
      status: "success",
      token: token,
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

const signout = async (req, res, next) => {
  res.clearCookie("jwt");
  return res.status(200).json({
    status: "success",
    message: "signed out successfully",
  });
};

const protect = expressJwt({
  secret: config.jwtSecret,
  algorithms: ["HS256"],
  userProperty: "auth",
});

const hasAuthorization = (req, res, next) => {
  const authorized = req.user && req.auth && req.user._id == req.auth.id;
  if (!authorized) {
    return res.status("403").json({
      status: "error",
      message: "User is not authorized",
    });
  }
  next();
};

export default { signin, signout, signup, protect, hasAuthorization };
