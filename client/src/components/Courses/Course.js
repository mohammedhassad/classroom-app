import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import PeopleIcon from "@material-ui/icons/Group";
import CompletedIcon from "@material-ui/icons/VerifiedUser";
import Edit from "@material-ui/icons/Edit";
import {
  Avatar,
  Button,
  Card,
  CardHeader,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@material-ui/core";
import { isAuthenticated } from "../Auth/auth-helpers";
import { getCourse, updateCourse } from "./api-course";
import CreateLesson from "./CreateLesson";
import DeleteCourse from "./DeleteCourse";
import Enroll from "../Enrollment/Enroll";
import { enrollmentStats } from "../Enrollment/api-enrollment";

const useStyles = makeStyles((theme) => ({
  root: theme.mixins.gutters({
    maxWidth: 800,
    margin: "auto",
    padding: theme.spacing(3),
  }),
  flex: {
    display: "flex",
    marginBottom: 20,
  },
  card: {
    padding: "24px 40px 40px",
  },
  subheading: {
    margin: "10px",
    color: theme.palette.openTitle,
  },
  details: {
    margin: "16px",
  },
  sub: {
    display: "block",
    margin: "3px 0px 5px 0px",
    fontSize: "0.9em",
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
    height: 190,
    display: "inline-block",
    width: "50%",
    marginLeft: "16px",
    objectFit: "contain",
  },
  icon: {
    verticalAlign: "sub",
  },
  category: {
    color: "#5c5c5c",
    fontSize: "0.9em",
    padding: "3px 5px",
    backgroundColor: "#dbdbdb",
    borderRadius: "0.2em",
    marginTop: 5,
  },
  action: {
    margin: "10px 0px",
    display: "flex",
    justifyContent: "flex-end",
  },
  statSpan: {
    margin: "7px 10px 0 10px",
    alignItems: "center",
    color: "#616161",
    display: "inline-flex",
    "& svg": {
      marginRight: 10,
      color: "#b6ab9a",
    },
  },
  enroll: {
    float: "right",
  },
}));

const Course = () => {
  const classes = useStyles();
  const params = useParams();
  // const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [course, setCourse] = useState({ instructor: {} });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.title = "Course";
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    getCourse({ courseId: params.courseId }, signal).then((data) => {
      if (data?.status === "error") {
        return;
      }

      if (data?.status === "success") {
        setCourse(data.course);
        return;
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, [params.courseId]);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    enrollmentStats(
      { courseId: params.courseId },
      { jwt: isAuthenticated().token },
      signal
    ).then((data) => {
      if (data?.status === "error") {
        return;
      }

      if (data?.status === "success") {
        setStats(data.stats);
        return;
      }
    });

    return function cleanup() {
      abortController.abort();
    };
  }, [params.courseId]);

  const addLesson = (course) => {
    setCourse(course);
  };

  const handleClickPublish = () => {
    if (course.lessons.length > 0) {
      setOpen(true);
    }
  };

  const handlePublish = () => {
    let courseData = new FormData();
    courseData.append("published", true);
    updateCourse(
      {
        courseId: params.courseId,
      },
      {
        jwt: isAuthenticated().token,
      },
      courseData
    ).then((data) => {
      if (data && data.status === "error") {
        return;
      }

      if (data?.status === "success") {
        setCourse({ ...course, published: true });
        setOpen(false);

        return;
      }
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const imageUrl = course._id && `/api/courses/photo/${course._id}`;

  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <CardHeader
          title={course.name}
          subheader={
            <div>
              <Link
                to={"/user/" + course.instructor._id}
                className={classes.sub}
              >
                By <span>{course.instructor.name}</span>
              </Link>
              <span className={classes.category}>{course.category}</span>
            </div>
          }
          action={
            <>
              {isAuthenticated().user &&
                isAuthenticated().user._id === course.instructor._id && (
                  <span className={classes.action}>
                    <Link to={"/teach/course/edit/" + course._id}>
                      <IconButton aria-label="Edit" color="secondary">
                        <Edit />
                      </IconButton>
                    </Link>
                    {!course.published ? (
                      <>
                        <Button
                          color="secondary"
                          variant="outlined"
                          onClick={handleClickPublish}
                        >
                          {course.lessons.length === 0
                            ? "Add atleast 1 lesson to publish"
                            : "Publish"}
                        </Button>
                        <DeleteCourse course={course} />
                      </>
                    ) : (
                      <Button color="primary" variant="outlined">
                        Published
                      </Button>
                    )}
                  </span>
                )}
              {course.published && (
                <div>
                  <span className={classes.statSpan}>
                    <PeopleIcon /> {stats.totalEnrolled} enrolled
                  </span>
                  <span className={classes.statSpan}>
                    <CompletedIcon /> {stats.totalCompleted} completed
                  </span>
                </div>
              )}
            </>
          }
        />
        <div className={classes.flex}>
          <CardMedia
            className={classes.media}
            image={imageUrl}
            title={course.name}
          />
          <div className={classes.details}>
            <Typography variant="body1" className={classes.subheading}>
              {course.description}
              <br />
            </Typography>

            {course.published && (
              <div className={classes.enroll}>
                <Enroll courseId={course._id} />
              </div>
            )}
          </div>
        </div>
        <Divider />
        <div>
          <CardHeader
            title={
              <Typography variant="h6" className={classes.subheading}>
                Lessons
              </Typography>
            }
            subheader={
              <Typography variant="body1" className={classes.subheading}>
                {course.lessons && course.lessons.length} lessons
              </Typography>
            }
            action={
              isAuthenticated().user &&
              isAuthenticated().user._id === course.instructor._id &&
              !course.published && (
                <span className={classes.action}>
                  <CreateLesson courseId={course._id} addLesson={addLesson} />
                </span>
              )
            }
          />
          <List>
            {course.lessons &&
              course.lessons.map((lesson, index) => {
                return (
                  <span key={index}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>{index + 1}</Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={lesson.title} />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </span>
                );
              })}
          </List>
        </div>
      </Card>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Publish Course</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Publishing your course will make it live to students for enrollment.
          </Typography>
          <Typography variant="body1">
            Make sure all lessons are added and ready for publishing.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" variant="contained">
            Cancel
          </Button>
          <Button onClick={handlePublish} color="secondary" variant="contained">
            Publish
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Course;
