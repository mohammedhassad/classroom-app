import { isAuthenticated } from "@/components/Auth/auth-helpers";
import {
  complete,
  getEnrollment,
} from "@/components/Enrollment/api-enrollment";
import { CheckCircle } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Container,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  styled,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import EnrollmentSidebar from "../components/Enrollment/Sidebar";

const StyledHeading = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  fontWeight: 300,
}));

const StyledSubHeading = styled(Typography)(({ theme }) => ({
  margin: "10px",
  color: theme.palette.openTitle,
}));

const StyledCard = styled(Card)({
  padding: "24px 40px 20px",
  boxShadow: "0px 0px 0px 1px rgb(140 140 140/.2)",
});

const ScreensEnrollment = () => {
  const { enrollmentId } = useParams();
  const [enrollment, setEnrollment] = useState({
    course: { instructor: [] },
    lessonStatus: [],
  });

  const [values, setValues] = useState({
    error: "",
    drawer: -1,
  });

  const [totalComplete, setTotalComplete] = useState(0);

  useEffect(() => {
    document.title = "Enrollment";
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    getEnrollment(
      { enrollmentId: enrollmentId },
      { jwt: isAuthenticated().token },
      signal
    ).then((data) => {
      if (data?.status === "error") {
        setValues({ ...values, error: data.message });
        return;
      }

      if (data?.status === "success") {
        totalCompleted(data.enrollment.lessonStatus);
        setEnrollment(data.enrollment);
        return;
      }
    });

    return function cleanup() {
      abortController.abort();
    };
  }, [enrollmentId, values]);

  const totalCompleted = (lessons) => {
    let count = lessons.reduce((total, lessonStatus) => {
      return total + (lessonStatus.complete ? 1 : 0);
    }, 0);
    setTotalComplete(count);
    return count;
  };

  const selectDrawer = (index) => () => {
    setValues({ ...values, drawer: index });
  };

  const markComplete = () => {
    if (!enrollment.lessonStatus[values.drawer].complete) {
      const lessonStatus = enrollment.lessonStatus;
      lessonStatus[values.drawer].complete = true;
      let count = totalCompleted(lessonStatus);

      let updatedData = {};
      updatedData.lessonStatusId = lessonStatus[values.drawer]._id;
      updatedData.complete = true;

      if (count === lessonStatus.length) {
        updatedData.courseCompleted = Date.now();
      }

      complete(
        {
          enrollmentId: enrollmentId,
        },
        {
          jwt: isAuthenticated().token,
        },
        updatedData
      ).then((data) => {
        if (data?.status === "error") {
          setValues({ ...values, error: data.error });
          return;
        }

        if (data?.status === "success") {
          setEnrollment({ ...enrollment, lessonStatus: lessonStatus });
          return;
        }
      });
    }
  };

  const imageUrl =
    enrollment.course._id && `/api/courses/photo/${enrollment.course._id}`;

  return (
    <>
      <EnrollmentSidebar
        selectDrawer={selectDrawer}
        values={values}
        enrollment={enrollment}
        totalComplete={totalComplete}
      />

      <Container
        sx={{
          margin: "auto",
          // my: "96px",
          marginLeft: "310px",
        }}
      >
        {values.drawer === -1 && (
          <StyledCard elevation={0}>
            <CardHeader
              title={enrollment.course.name}
              subheader={
                <Box>
                  <Box
                    as={Link}
                    to={"/user/" + enrollment.course.instructor._id}
                    sx={{
                      display: "block",
                      margin: "3px 0px 5px 0px",
                      fontSize: "0.9em",
                    }}
                  >
                    By {enrollment.course.instructor.name}
                  </Box>

                  <Box
                    as="span"
                    sx={{
                      color: "#5c5c5c",
                      fontSize: "0.9em",
                      padding: "3px 5px",
                      backgroundColor: "#dbdbdb",
                      borderRadius: "0.2em",
                      marginTop: 5,
                    }}
                  >
                    {enrollment.course.category}
                  </Box>
                </Box>
              }
              action={
                totalComplete === enrollment.lessonStatus.length && (
                  <Box
                    as="span"
                    sx={{
                      margin: "8px 24px",
                      display: "inline-block",
                    }}
                  >
                    <Button variant="contained" color="secondary">
                      <CheckCircle /> &nbsp; Completed
                    </Button>
                  </Box>
                )
              }
            />

            <CardContent>
              <Grid container spacing={3}>
                <Grid xs={6}>
                  <CardMedia
                    image={imageUrl}
                    title={enrollment.course.name}
                    sx={{
                      height: 280,
                      // display: "inline-block",
                      width: "100%",
                      backgroundSize: "contain",
                    }}
                  />
                </Grid>

                <Grid xs={6}>
                  <Box>
                    <StyledSubHeading variant="body1">
                      {enrollment.course.description}
                    </StyledSubHeading>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>

            <Divider />

            <Box>
              <CardHeader
                title={
                  <StyledSubHeading variant="h6">Lessons</StyledSubHeading>
                }
                subheader={
                  <StyledSubHeading variant="body1">
                    {enrollment.course.lessons &&
                      enrollment.course.lessons.length}{" "}
                    lessons
                  </StyledSubHeading>
                }
                action={
                  isAuthenticated().user &&
                  isAuthenticated().user._id ===
                    enrollment.course.instructor._id && (
                    <Box as="span" m="8px 24px" display="inline-block"></Box>
                  )
                }
              />

              <CardContent>
                <List disablePadding>
                  {enrollment.course.lessons &&
                    enrollment.course.lessons.map((lesson, i) => {
                      return (
                        <span key={i}>
                          <ListItem>
                            <ListItemAvatar>
                              <Avatar>{i + 1}</Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={lesson.title} />
                          </ListItem>
                          <Divider variant="inset" />
                        </span>
                      );
                    })}
                </List>
              </CardContent>
            </Box>
          </StyledCard>
        )}

        {values.drawer !== -1 && (
          <>
            <StyledHeading variant="h5">{enrollment.course.name}</StyledHeading>

            <StyledCard elevation={0}>
              <CardHeader
                title={enrollment.course.lessons[values.drawer].title}
                action={
                  <Button
                    onClick={markComplete}
                    variant={
                      enrollment.lessonStatus[values.drawer].complete
                        ? "contained"
                        : "outlined"
                    }
                    color="secondary"
                  >
                    {enrollment.lessonStatus[values.drawer].complete
                      ? "Completed"
                      : "Mark as complete"}
                  </Button>
                }
              />
              <CardContent>
                <Typography
                  variant="body1"
                  sx={{
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {enrollment.course.lessons[values.drawer].content}
                </Typography>
              </CardContent>
              <CardActions>
                <a href={enrollment.course.lessons[values.drawer].resourceUrl}>
                  <Button variant="contained" color="primary">
                    Resource Link
                  </Button>
                </a>
              </CardActions>
            </StyledCard>
          </>
        )}
      </Container>
    </>
  );
};

export default ScreensEnrollment;
