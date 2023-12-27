import PropTypes from "prop-types";
import { Field } from "formik";
import { Button, FormControl, Stack, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const UploadImage = ({
  name,
  handleChange,
  label,
  justify = "center",
  ...props
}) => {
  return (
    <Field name={name}>
      {({ field, form }) => (
        <>
          <FormControl fullWidth>
            <Stack
              alignItems="center"
              justifyContent={justify}
              direction="row"
              spacing={2}
            >
              <label htmlFor="file">
                <Button
                  {...props}
                  component="span"
                  endIcon={<CloudUploadIcon />}
                >
                  {label}
                </Button>
              </label>
              <Typography component="span" sx={{ fontSize: "13px" }}>
                {field.value ? field.value.name : ""}
              </Typography>

              <input
                accept="image/*"
                onChange={(event) => handleChange(event, form)}
                style={{ display: "none" }}
                id="file"
                type="file"
              />
            </Stack>
          </FormControl>
        </>
      )}
    </Field>
  );
};

UploadImage.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  justify: PropTypes.string,
};

export default UploadImage;
