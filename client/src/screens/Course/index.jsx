import { isAuthenticated } from "@/components/Auth/auth-helpers";
import CourseDelete from "@/components/Course/Delete";
import CourseLessonCreate from "@/components/Course/Lesson/Create";
import { getCourse, updateCourse } from "@/components/Course/api-course";
import EnrollmentButton from "@/components/Enrollment/Button";
import { enrollmentStats } from "@/components/Enrollment/api-enrollment";
import Edit from "@mui/icons-material/Edit";
import PeopleIcon from "@mui/icons-material/Group";
import CompletedIcon from "@mui/icons-material/VerifiedUser";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
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
  Stack,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const StyledSub = styled(Box)(({ theme }) => ({
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
}));

const StyledAction = styled(Box)({
  margin: "10px 0px",
  display: "flex",
  justifyContent: "flex-end",
});

const StyledStateSpan = styled(Box)({
  margin: "7px 10px 0 10px",
  alignItems: "center",
  color: "#616161",
  display: "inline-flex",

  "& svg": {
    marginRight: 10,
    color: "#b6ab9a",
  },
});

const StyledCategory = styled("span")({
  color: "#5c5c5c",
  fontSize: "0.9em",
  padding: "3px 5px",
  backgroundColor: "#dbdbdb",
  borderRadius: "0.2em",
  marginTop: 5,
});

const ScreensCourse = () => {
  const theme = useTheme();
  const params = useParams();
  const [stats, setStats] = useState({});
  const [course, setCourse] = useState({});
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

  const imageUrl = course?._id && `/api/courses/photo/${course._id}`;

  return (
    <>
      <Card
        sx={{
          maxWidth: 950,
          margin: "auto",
          padding: "24px 40px 40px",
          boxShadow: "0px 0px 0px 1px rgb(140 140 140/.2)",
        }}
        elevation={0}
      >
        <CardHeader
          title={course.name}
          subheader={
            <Box>
              <StyledSub as={Link} to={"/user/" + course?.instructor?._id}>
                By <span>{course?.instructor?.name}</span>
              </StyledSub>

              <StyledCategory>{course?.category}</StyledCategory>
            </Box>
          }
          action={
            <>
              {isAuthenticated()?.user &&
                isAuthenticated()?.user?._id === course?.instructor?._id && (
                  <StyledAction>
                    <Link to={"/teach/course/edit/" + course?._id}>
                      <IconButton aria-label="Edit" color="secondary">
                        <Edit />
                      </IconButton>
                    </Link>
                    {!course?.published ? (
                      <>
                        <Button
                          color="secondary"
                          variant="outlined"
                          onClick={handleClickPublish}
                        >
                          {course?.lessons?.length === 0
                            ? "Add atleast 1 lesson to publish"
                            : "Publish"}
                        </Button>
                        <CourseDelete course={course} />
                      </>
                    ) : (
                      <Button color="primary" variant="outlined">
                        Published
                      </Button>
                    )}
                  </StyledAction>
                )}
              {course?.published && (
                <Box>
                  <StyledStateSpan as="span">
                    <PeopleIcon /> {stats?.totalEnrolled} enrolled
                  </StyledStateSpan>

                  <StyledStateSpan as="span">
                    <CompletedIcon /> {stats?.totalCompleted} completed
                  </StyledStateSpan>
                </Box>
              )}
            </>
          }
        />

        <CardContent>
          <Grid container spacing={3}>
            <Grid xs={5}>
              <CardMedia
                image={imageUrl}
                title={course?.name}
                sx={{
                  height: 190,
                  display: "inline-block",
                  width: "100%",
                  objectFit: "contain",
                  objectPosition: "center",
                }}
              />
            </Grid>

            <Grid xs={7}>
              <Stack spacing={3}>
                <Typography variant="body1">{course?.description}</Typography>

                {course?.published && (
                  <Box>
                    <EnrollmentButton courseId={course?._id} />
                  </Box>
                )}
              </Stack>
            </Grid>
          </Grid>
        </CardContent>

        <Divider />

        <Box>
          <CardHeader
            title={
              <Typography variant="h6" color={theme.palette.openTitle}>
                Lessons
              </Typography>
            }
            subheader={
              <Typography variant="body1" color="grey">
                {course?.lessons?.length} lessons
              </Typography>
            }
            action={
              isAuthenticated()?.user &&
              isAuthenticated()?.user?._id === course?.instructor?._id &&
              !course?.published && (
                <StyledAction as="span">
                  <CourseLessonCreate
                    courseId={course?._id}
                    addLesson={addLesson}
                  />
                </StyledAction>
              )
            }
          />

          <CardContent>
            <List disablePadding>
              {course?.lessons?.map((lesson, index) => {
                return (
                  <Box key={index}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>{index + 1}</Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={lesson?.title} />
                    </ListItem>
                    <Divider variant="inset" />
                  </Box>
                );
              })}
            </List>
          </CardContent>
        </Box>
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
          <Button onClick={handlePublish} color="secondary" variant="contained">
            Publish
          </Button>
          <Button onClick={handleClose} color="primary" variant="contained">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ScreensCourse;
