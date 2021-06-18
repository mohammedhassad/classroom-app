const joiError = (rawErrors) => {
  const errors = {};
  const { details } = rawErrors;

  details.forEach((d) => {
    errors[d.path] = d.message;
  });

  return errors;
};

export default { joiError };
