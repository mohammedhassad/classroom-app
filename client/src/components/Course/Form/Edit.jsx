import { isAuthenticated } from "@/components/Auth/auth-helpers";
import { getCourse, updateCourse } from "@/components/Course/api-course";
import Input from "@/components/UI/Input";
import UploadImage from "@/components/UI/UploadImage";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Divider,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { FieldArray, Form, Formik } from "formik";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import CourseLessonCard from "@/components/Course/Lesson/Card";

const initialValues = {
  name: "",
  description: "",
  category: "",
  image: "",
  lessons: [
    {
      title: "",
      content: "",
      resourceUrl: "",
    },
  ],
};

const validationSchema = Yup.object().shape({
  name: Yup.string().required().trim(),
  description: Yup.string().required().trim(),
  category: Yup.string().required().trim(),
  image: Yup.mixed(),
  lessons: Yup.array().of(
    Yup.object().shape({
      title: Yup.string().required().trim(),
      content: Yup.string().required().trim(),
      resourceUrl: Yup.string().url().required().trim(),
    })
  ),
});

const CourseFormEdit = () => {
  const theme = useTheme();
  const params = useParams();
  const navigate = useNavigate();
  const formikRef = useRef();
  const [course, setCourse] = useState({ instructor: {} });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    getCourse({ courseId: params.courseId }, signal).then((data) => {
      if (data && data.status === "error") {
        console.log(data);
        return;
      }

      if (data?.status === "success" && formikRef.current) {
        formikRef.current.setFieldValue("name", data.course.name);
        formikRef.current.setFieldValue("description", data.course.description);
        formikRef.current.setFieldValue("category", data.course.category);
        formikRef.current.setFieldValue("lessons", data.course.lessons);

        setCourse(data.course);
      }
    });

    return function cleanup() {
      abortController.abort();
    };
  }, [params.courseId]);

  const handleSubmit = async (values, errors) => {
    setLoading(true);

    if (values.image) {
      if (values.image.type && !values.image.type.startsWith("image")) {
        errors.setErrors({ image: "PLease upload image" });
        return;
      }
    }

    const courseData = new FormData();

    values.name && courseData.append("name", values.name);
    values.description && courseData.append("description", values.description);
    values.category && courseData.append("category", values.category);
    values.image && courseData.append("image", values.image);
    courseData.append("lessons", JSON.stringify(values.lessons));

    const data = await updateCourse(
      { courseId: params.courseId },
      { jwt: isAuthenticated().token },
      courseData
    );

    if (data && data.status === "error") {
      data.errors && errors.setErrors(data.errors);
    }

    if (data?.status === "success") {
      navigate(`/teach/course/${course._id}`);
    }

    setLoading(false);
  };

  const handleChangeImage = (event, form) => {
    form.setFieldValue("image", event.target.files[0]);
  };

  const imageUrl = course._id && `/api/courses/photo/${course._id}`;

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      innerRef={formikRef}
    >
      {({ values }) => (
        <Form>
          <CardHeader
            title={
              <Typography
                variant="h6"
                sx={{
                  color: theme.palette.openTitle,
                }}
              >
                Edit Course
              </Typography>
            }
            sx={{
              p: 0,
              mb: 4,
            }}
          />

          <CardContent
            sx={{
              p: 0,
            }}
          >
            <Stack spacing={2} mb={3}>
              {/* Name Course Field */}
              <Input name="name" label="Name :" required fullWidth />

              <Box
                as={Link}
                to={"/user/" + course?.instructor?._id}
                sx={{
                  display: "block",
                  margin: "3px 0px 5px 0px",
                  fontSize: "1em",
                  textDecoration: "none",
                  color: "#262626",

                  "&:hover": {
                    textDecoration: "underline",
                  },

                  "& span": {
                    fontWeight: theme.typography.fontWeightMedium,
                    textTransform: "capitalize",
                  },
                }}
              >
                By <span>{course?.instructor?.name}</span>
              </Box>

              {/* Category Course Field */}
              <Input name="category" label="Category :" required fullWidth />
            </Stack>

            <Grid container spacing={3} mb={3} mt={2}>
              <Grid xs={5}>
                <CardMedia
                  image={imageUrl}
                  title={course?.name}
                  sx={{
                    height: "250px",
                    width: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                  }}
                />
              </Grid>

              <Grid xs={7}>
                <Stack spacing={2}>
                  {/* Name Course Field*/}
                  <Input
                    name="description"
                    label="Description :"
                    multiline
                    rows="5"
                    required
                    fullWidth
                  />

                  {/* Upload Image */}
                  <UploadImage
                    name="image"
                    label="Change Photo"
                    handleChange={handleChangeImage}
                    variant="outlined"
                    color="secondary"
                    justify="start"
                  />
                </Stack>
              </Grid>
            </Grid>

            <Divider />

            {/* List Lessons */}
            <Box>
              <CardHeader
                title={
                  <Typography variant="h6" color={theme.palette.openTitle}>
                    Lessons - Edit and Rearrange
                  </Typography>
                }
                subheader={
                  <Typography variant="body1" color="grey">
                    {values?.lessons?.length} lessons
                  </Typography>
                }
                sx={{
                  my: 3,
                  p: 0,
                }}
              />

              {/* card lessons */}
              <Box>
                <FieldArray
                  name="lessons"
                  render={({ remove, move }) => (
                    <CourseLessonCard
                      remove={remove}
                      move={move}
                      lessons={values.lessons}
                      published={course.published}
                    />
                  )}
                />
              </Box>
            </Box>
          </CardContent>

          {isAuthenticated()?.user &&
            isAuthenticated()?.user?._id === course?.instructor?._id && (
              <CardActions
                sx={{
                  p: 0,
                }}
              >
                <LoadingButton
                  loading={loading}
                  variant="contained"
                  color="primary"
                  type="submit"
                  sx={{
                    mt: theme.spacing(1),
                    height: "45px",
                    width: 300,
                  }}
                >
                  Save
                </LoadingButton>
              </CardActions>
            )}
        </Form>
      )}
    </Formik>
  );
};

export default CourseFormEdit;
