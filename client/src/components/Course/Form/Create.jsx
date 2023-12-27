import { isAuthenticated } from "@/components/Auth/auth-helpers";
import { create } from "@/components/Course/api-course";
import Input from "@/components/UI/Input";
import UploadImage from "@/components/UI/UploadImage";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Box,
  Button,
  CardContent,
  CardHeader,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { Form, Formik } from "formik";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";

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

const CourseFormCreate = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values, errors) => {
    setLoading(true);

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

    const data = await create(
      { userId: isAuthenticated().user._id },
      { jwt: isAuthenticated().token },
      courseData
    );

    if (data && data.status === "error") {
      data.message = data.message || (data.errors && "Validation error.");

      setMessage(data.message);

      data.errors && errors.setErrors(data.errors);
    }

    if (data?.status === "success") {
      errors.resetForm();
      navigate("/teach/courses");
    }

    setLoading(false);
  };

  const handleChangeImage = (event, form) => {
    form.setFieldValue("image", event.target.files[0]);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form>
        <CardHeader
          title={
            <Typography
              variant="h6"
              sx={{
                color: theme.palette.openTitle,
              }}
            >
              New Course
            </Typography>
          }
        />

        <CardContent>
          <Stack alignItems="center" width="90%" mx="auto">
            {message && (
              <Box mb={2} width="100%">
                <Alert
                  variant="filled"
                  severity="error"
                  sx={{
                    fontWeight: 400,
                    textAlign: "start",
                  }}
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
              variant="contained"
              color="secondary"
            />

            <Stack width="100%" alignItems="center" spacing={2} mt={4}>
              {/* Name Course Field */}
              <Input name="name" label="Name :" required fullWidth />

              {/* Description Course Field */}
              <Input
                name="description"
                label="Description :"
                required
                multiline
                rows={2}
                fullWidth
              />

              {/* Category Course Field */}
              <Input name="category" label="Category :" required fullWidth />

              <Stack
                width="100%"
                direction="row"
                alignItems="center"
                spacing={3}
              >
                <LoadingButton
                  loading={loading}
                  variant="contained"
                  color="primary"
                  type="submit"
                  sx={{
                    height: "45px",
                    width: "50%",
                  }}
                >
                  Submit
                </LoadingButton>

                <Button
                  component={Link}
                  to="/teach/courses"
                  variant="outlined"
                  sx={{
                    height: "45px",
                    width: "50%",
                  }}
                >
                  Cancel
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </CardContent>
      </Form>
    </Formik>
  );
};

export default CourseFormCreate;
