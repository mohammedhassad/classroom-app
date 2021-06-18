import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import ArrowUp from "@material-ui/icons/ArrowUpward";
import {
  Avatar,
  Button,
  Card,
  CardHeader,
  CardMedia,
  CardActions,
  Divider,
  IconButton,
  Typography,
  Box,
} from "@material-ui/core";
import { isAuthenticated } from "../Auth/auth-helpers";
import { getCourse, updateCourse } from "./api-course";
import { FieldArray, Form, Formik } from "formik";
import Input from "../../utils/Input";
import UploadImage from "../../utils/UploadImage";
import * as Yup from "yup";

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

const useStyles = makeStyles((theme) => ({
  root: theme.mixins.gutters({
    maxWidth: 1000,
    margin: "auto",
    padding: theme.spacing(3),
  }),
  card: {
    padding: "24px 40px 40px",
  },
  subheading: {
    margin: "10px",
    color: theme.palette.openTitle,
  },
  upArrow: {
    border: "2px solid #f57c00",
    marginLeft: 3,
    marginTop: 10,
    padding: 4,
  },
  sub: {
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
  },
  media: {
    height: 250,
    width: "50%",
    display: "inline-block",
    marginLeft: "16px",
    objectFit: "contain",
  },
  textField: {
    // width: (props) => props.width && props.width,
    "& .MuiInputBase-root, & .MuiFormLabel-root": {
      padding: theme.spacing(0, 1),
    },
  },
  button: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
    right: 0,
    height: 45,
    width: 300,
    borderRadius: 50,
  },
  cardActions: {
    justifyContent: "flex-end",
  },
}));

const EditCourse = () => {
  const classes = useStyles();
  const params = useParams();
  const navigate = useNavigate();
  const formikRef = useRef();
  const [course, setCourse] = useState({ instructor: {} });

  useEffect(() => {
    document.title = "Edit Course";
  }, []);

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

  const handleSubmit = (values, errors) => {
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

    updateCourse(
      { courseId: params.courseId },
      { jwt: isAuthenticated().token },
      courseData
    ).then((data) => {
      if (data && data.status === "error") {
        data.errors && errors.setErrors(data.errors);
        return;
      }

      if (data?.status === "success") {
        return navigate(`/teach/course/${course._id}`);
      }
    });
  };

  const handleChangeImage = (event, form) => {
    form.setFieldValue("image", event.target.files[0]);
  };

  const imageUrl = course._id && `/api/courses/photo/${course._id}`;

  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          innerRef={formikRef}
        >
          {({ values, touched, errors }) => (
            <Form>
              <Box mb={3}>
                {/* Name Course Field */}
                <Input
                  name="name"
                  label="Name :"
                  required
                  fullWidth
                  classes={{ root: classes.textField }}
                />

                <Link
                  to={"/user/" + course.instructor._id}
                  className={classes.sub}
                >
                  By <span>{course.instructor.name}</span>
                </Link>

                {/* Category Course Field */}
                <Input
                  name="category"
                  label="Category :"
                  required
                  fullWidth
                  classes={{ root: classes.textField }}
                />
              </Box>

              <Box display="flex" my={3}>
                <CardMedia
                  className={classes.media}
                  image={imageUrl}
                  title={course.name}
                />

                <Box m={2} p={2}>
                  {/* Name Course Field*/}
                  <Input
                    name="description"
                    label="Description :"
                    multiline
                    rows="5"
                    required
                    classes={{ root: classes.textField }}
                    style={{ width: 350 }}
                  />

                  {/* Upload Image */}
                  <UploadImage
                    name="image"
                    label="Change Photo"
                    handleChange={handleChangeImage}
                    button={{
                      variant: "outlined",
                      color: "secondary",
                    }}
                  />
                </Box>
              </Box>

              <Divider />

              {/* List Lessons */}
              <Box>
                <CardHeader
                  title={
                    <Typography variant="h6" className={classes.subheading}>
                      Lessons - Edit and Rearrange
                    </Typography>
                  }
                  subheader={
                    <Typography variant="body1" className={classes.subheading}>
                      {values.lessons && values.lessons.length} lessons
                    </Typography>
                  }
                />

                {/* card lessons */}
                <Box mb={2}>
                  <FieldArray
                    name="lessons"
                    render={({ remove, move }) => (
                      <CardLessons
                        remove={remove}
                        move={move}
                        lessons={values.lessons}
                        published={course.published}
                        classes={{
                          upArrow: classes.upArrow,
                          textField: classes.textField,
                        }}
                      />
                    )}
                  />
                </Box>
              </Box>

              {isAuthenticated().user &&
                isAuthenticated().user._id === course.instructor._id && (
                  <CardActions className={classes.cardActions}>
                    <Button
                      variant="contained"
                      color="secondary"
                      type="submit"
                      className={classes.button}
                    >
                      Save
                    </Button>
                  </CardActions>
                )}
            </Form>
          )}
        </Formik>
      </Card>
    </div>
  );
};

const CardLessons = ({ remove, move, lessons, published, classes }) => {
  return (
    <Box>
      {lessons &&
        lessons.map((lesson, index) => {
          return (
            <Box key={index} mb={2}>
              <Box display="flex" alignItems="center" bgcolor="#f3f3f3" p={2}>
                <Box>
                  <Avatar>{index + 1}</Avatar>
                  {index !== 0 && (
                    <IconButton
                      aria-label="up"
                      color="primary"
                      onClick={(event) => move(index, index - 1)}
                      className={classes.upArrow}
                    >
                      <ArrowUp />
                    </IconButton>
                  )}
                </Box>

                <Box mx={2} flex={1}>
                  {/* Title Course Field */}
                  <Input
                    name={`lessons.${index}.title`}
                    label="Title :"
                    required
                    fullWidth
                    classes={{ root: classes.textField }}
                  />

                  {/* Content Course Field */}
                  <Input
                    name={`lessons.${index}.content`}
                    label="Content :"
                    required
                    fullWidth
                    classes={{ root: classes.textField }}
                    multiline
                    rows="5"
                  />

                  {/* ResourceUrl Course Field */}
                  <Input
                    name={`lessons.${index}.resourceUrl`}
                    label="Resource Link :"
                    required
                    fullWidth
                    classes={{ root: classes.textField }}
                  />
                </Box>

                {!published && (
                  <IconButton
                    edge="end"
                    aria-label="up"
                    color="primary"
                    onClick={() => remove(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>
            </Box>
          );
        })}
    </Box>
  );
};

export default EditCourse;
