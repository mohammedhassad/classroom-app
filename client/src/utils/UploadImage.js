import React from "react";
import PropTypes from "prop-types";
import { Field } from "formik";
import { Button, FormControl } from "@material-ui/core";
import FileUpload from "@material-ui/icons/AddPhotoAlternate";

const UploadImage = ({ name, handleChange, label, button }) => {
  return (
    <Field name={name}>
      {({ field, form, meta }) => (
        <>
          <FormControl style={{ display: "block" }}>
            <input
              accept="image/*"
              onChange={(event) => handleChange(event, form)}
              style={{ display: "none" }}
              id="icon-button-file"
              type="file"
            />
            <label htmlFor="icon-button-file">
              <Button {...button} component="span" endIcon={<FileUpload />}>
                {label}
              </Button>
            </label>
            <span style={{ marginLeft: "10px" }}>
              {field.value ? field.value.name : ""}
            </span>
          </FormControl>
        </>
      )}
    </Field>
  );
};

UploadImage.prototypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  button: PropTypes.object,
};

export default UploadImage;
