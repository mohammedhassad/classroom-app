import Joi from "joi";
Joi.objectId = require("joi-objectid")(Joi);

const createCourse = (obj) => {
  const schema = Joi.object({
    name: Joi.string().required().trim(),
    description: Joi.string().required().trim(),
    category: Joi.string().required().trim(),
  });

  return schema.validate(obj);
};

const updateCourse = (obj) => {
  const schema = Joi.object({
    name: Joi.string().required().trim(),
    description: Joi.string().required().trim(),
    category: Joi.string().required().trim(),
    lessons: Joi.array()
      .items({
        title: Joi.string().required().trim(),
        content: Joi.string().required().trim(),
        resourceUrl: Joi.string().uri().required().trim(),
      })
      .allow(null),
  });

  return schema.validate(obj);
};

const createLesson = (obj) => {
  const schema = Joi.object({
    title: Joi.string().required().trim(),
    content: Joi.string().required().trim(),
    resourceUrl: Joi.string().uri().required().trim(),
  });

  return schema.validate(obj);
};

export default { createCourse, updateCourse, createLesson };
