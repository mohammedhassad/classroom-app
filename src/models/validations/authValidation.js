import Joi from "joi";

const signin = (obj) => {
  const schema = Joi.object({
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "io"] } })
      .required()
      .lowercase()
      .trim(),
    password: Joi.string().required().min(8),
  });

  return schema.validate(obj);
};

const signup = (obj) => {
  const schema = Joi.object({
    name: Joi.string().required().lowercase().trim().min(3),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "io"] } })
      .required()
      .lowercase()
      .trim(),
    password: Joi.string().required().min(8),
    confirmPassword: Joi.ref("password"),
  }).with("password", "confirmPassword");

  return schema.validate(obj);
};

export default { signin, signup };
