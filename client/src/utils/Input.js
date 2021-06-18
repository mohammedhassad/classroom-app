import React from "react";
import PropTypes from "prop-types";
import { TextField } from "@material-ui/core";
import { ErrorMessage, Field } from "formik";

const Input = ({ name, type = "text", label, ...rest }) => {
  return (
    <Field name={name}>
      {({
        field: { onChange, name, value },
        form,
        meta: { touched, error },
      }) => (
        <TextField
          name={name}
          type={type}
          margin="normal"
          label={label}
          value={value}
          onChange={onChange}
          error={touched && Boolean(error)}
          helperText={<ErrorMessage name={name} />}
          {...rest}
        />
      )}
    </Field>
  );
};

Input.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  label: PropTypes.string,
};

export default Input;
