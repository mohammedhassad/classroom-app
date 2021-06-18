import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
  Box,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { create } from "./api-course";
import { isAuthenticated } from "../Auth/auth-helpers";
import Input from "../../utils/Input";
import UploadImage from "../../utils/UploadImage";

const initialValues = {
  name: "",
  description: "",
  category: "",
  image: {},
};

const validationSchema = Yup.object().shape({
  name: Yup.string().required().trim(),
  description: Yup.string().required().trim(),
  category: Yup.string().required().trim(),
  image: Yup.mixed(),
});

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 600,
    margin: "auto",
    textAlign: "center",
    paddingBottom: theme.spacing(2),
  },
  title: {
    marginTop: theme.spacing(2),
    color: theme.palette.openTitle,
    marginBottom: theme.spacing(2),
  },
  textField: {
    width: 400,
    "& .MuiInputBase-root, & .MuiFormLabel-root": {
      padding: theme.spacing(0, 1),
    },
  },
  button: {
    margin: "auto",
    marginBottom: theme.spacing(2),
    height: 45,
    width: 200,
    borderRadius: 50,
  },
  cardContent: {
    padding: theme.spacing(2, 5),
  },
}));

const CreateCourse = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  useEffect(() => {
    document.title = "Create Course";
  }, []);

  const handleSubmit = (values, errors) => {
    if (values.image) {
      if (values.image.type && !values.image.type.startsWith("image")) {
        errors.setErrors({ image: "PLease upload image" });
        return;
      }
    }

    let courseData = new FormData();

    values.name && courseData.append("name", values.name);
    values.description && courseData.append("description", values.description);
    values.category && courseData.append("category", values.category);
    values.image && courseData.append("image", values.image);

    create(
      { userId: isAuthenticated().user._id },
      { jwt: isAuthenticated().token },
      courseData
    ).then((data) => {
      if (data && data.status === "error") {
        data.message = data.message || (data.errors && "Validation error.");

        setMessage(data.message);

        data.errors && errors.setErrors(data.errors);
        return;
      }

      if (data?.status === "success") {
        errors.resetForm();
        return navigate("/teach/courses");
      }
    });
  };

  const handleChangeImage = (event, form) => {
    form.setFieldValue("image", event.target.files[0]);
  };

  return (
    <div>
      <Card className={classes.card}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <CardContent>
              <Typography variant="h6" className={classes.title}>
                New Course
              </Typography>

              {message && (
                <Box my={2} mx={"auto"} width={350}>
                  <Alert
                    variant="filled"
                    severity="error"
                    onClose={() => setMessage("")}
                  >
                    {message}
                  </Alert>
                </Box>
              )}

              {/* Upload Image */}
              <UploadImage
                name="image"
                label="Upload Image"
                handleChange={handleChangeImage}
                button={{
                  variant: "contained",
                  color: "secondary",
                }}
              />

              {/* Name Course Field */}
              <Input
                name="name"
                label="Name :"
                fullWidth
                required
                classes={{ root: classes.textField }}
              />

              {/* Description Course Field */}
              <Input
                name="description"
                label="Description :"
                required
                fullWidth
                classes={{ root: classes.textField }}
                multiline
                rows={2}
              />

              {/* Category Course Field */}
              <Input
                name="category"
                label="Category :"
                required
                fullWidth
                classes={{ root: classes.textField }}
              />
            </CardContent>

            <CardActions>
              <Button
                color="primary"
                variant="contained"
                type="submit"
                className={classes.button}
              >
                Submit
              </Button>

              <Button
                component={Link}
                to="/teach/courses"
                variant="contained"
                className={classes.button}
              >
                Cancel
              </Button>
            </CardActions>
          </Form>
        </Formik>
      </Card>
    </div>
  );
};

export default CreateCourse;
