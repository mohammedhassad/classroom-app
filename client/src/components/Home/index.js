import React, { useEffect, useState } from "react";
import { Card, CardMedia, CardContent, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { listEnrolled } from "../Enrollment/api-enrollment";
import { isAuthenticated } from "../Auth/auth-helpers";
import { listPublished } from "../Courses/api-course";
import Enrollments from "../Enrollment/Enrollments";
import Courses from "../Courses";

const useStyles = makeStyles((theme) => ({
  card: {
    width: "90%",
    margin: "auto",
    marginTop: 20,
    marginBottom: theme.spacing(2),
    padding: 20,
    backgroundColor: "#ffffff",
  },
  title: {
    padding: `${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(
      2
    )}px`,
    color: theme.palette.openTitle,
  },
  media: {
    minHeight: 400,
  },
  gridList: {
    width: "100%",
    minHeight: 200,
    padding: "16px 0 10px",
  },
  tile: {
    textAlign: "center",
  },
  image: {
    height: "100%",
  },
  tileBar: {
    backgroundColor: "rgba(0, 0, 0, 0.72)",
    textAlign: "left",
  },
  enrolledTitle: {
    color: "#efefef",
    marginBottom: 5,
  },
  action: {
    margin: "0 10px",
  },
  enrolledCard: {
    backgroundColor: "#616161",
  },
  divider: {
    marginBottom: 16,
    backgroundColor: "rgb(157, 157, 157)",
  },
  noTitle: {
    color: "lightgrey",
    marginBottom: 12,
    marginLeft: 8,
  },
}));

const Home = () => {
  const classes = useStyles();
  const [courses, setCourses] = useState([]);
  const [enrolled, setEnrolled] = useState([]);

  useEffect(() => {
    document.title = "Home";
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    listEnrolled({ jwt: isAuthenticated().token }, signal).then((data) => {
      if (data?.status === "error") {
        console.log(data.error);
        return;
      }

      if (data?.status === "success") {
        setEnrolled(data.enrollments);
        return;
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    listPublished(signal).then((data) => {
      if (data?.status === "error") {
        return;
      }

      if (data?.status === "success") {
        setCourses(data.courses);
        return;
      }
    });

    return function cleanup() {
      abortController.abort();
    };
  }, []);

  return (
    <div>
      {isAuthenticated().user && (
        <Card className={`${classes.card} ${classes.enrolledCard}`}>
          <Typography
            variant="h6"
            component="h2"
            className={classes.enrolledTitle}
          >
            Courses you are enrolled in
          </Typography>
          {enrolled.length !== 0 ? (
            <Enrollments enrollments={enrolled} />
          ) : (
            <Typography variant="body1" className={classes.noTitle}>
              No courses.
            </Typography>
          )}
        </Card>
      )}
      <Card className={classes.card}>
        <Typography variant="h5" component="h2">
          All Courses
        </Typography>
        {courses.length !== 0 && courses.length !== enrolled.length ? (
          <Courses courses={courses} common={enrolled} />
        ) : (
          <Typography variant="body1" className={classes.noTitle}>
            No new courses.
          </Typography>
        )}
      </Card>
    </div>
  );
};

export default Home;
