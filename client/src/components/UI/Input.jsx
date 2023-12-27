import { TextField } from "@mui/material";
import { ErrorMessage, Field } from "formik";
import PropTypes from "prop-types";

const Input = ({ name, type = "text", label, ...rest }) => {
  return (
    <Field name={name}>
      {({ field: { onChange, name, value }, meta: { touched, error } }) => (
        <TextField
          name={name}
          type={type}
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
  variant: PropTypes.string,
};

export default Input;
