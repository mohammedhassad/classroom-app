import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  Avatar,
  Button,
  Container,
  Divider,
  Icon,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography,
} from "@material-ui/core";
import { listByInstructor } from "./api-course";
import { isAuthenticated } from "../Auth/auth-helpers";

const useStyles = makeStyles((theme) => ({
  root: theme.mixins.gutters({
    maxWidth: 900,
    margin: "auto",
    padding: theme.spacing(3),
  }),
  title: {
    margin: `${theme.spacing(3)}px 0 ${theme.spacing(3)}px ${theme.spacing(
      1
    )}px`,
    color: theme.palette.protectedTitle,
    fontSize: "1.2em",
  },
  addButton: {
    float: "right",
  },
  leftIcon: {
    marginRight: "8px",
  },
  avatar: {
    borderRadius: 0,
    width: 65,
    height: 40,
  },
  listText: {
    marginLeft: 16,
  },
}));

const MyCourses = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    document.title = "My Courses";
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    listByInstructor(
      {
        userId: isAuthenticated().user._id,
      },
      { jwt: isAuthenticated().token },
      signal
    ).then((data) => {
      if (data?.status === "error") {
        return navigate("/signin");
      }

      if (data?.status === "success") {
        return setCourses(data.courses);
      }
    });

    return function cleanup() {
      abortController.abort();
    };
  }, [navigate]);

  return (
    <Container>
      <Paper className={classes.root} elevation={4}>
        <Typography type="title" className={classes.title}>
          Your Courses
          <span className={classes.addButton}>
            <Link to="/teach/course/create">
              <Button color="primary" variant="contained">
                <Icon className={classes.leftIcon}>add_box</Icon> New Course
              </Button>
            </Link>
          </span>
        </Typography>
        <List dense>
          {courses.map((course, index) => {
            return (
              <>
                <ListItem
                  button
                  component={Link}
                  to={"/teach/course/" + course._id}
                  key={index}
                >
                  <ListItemAvatar>
                    <Avatar
                      src={
                        "/api/courses/photo/" +
                        course._id +
                        "?" +
                        new Date().getTime()
                      }
                      className={classes.avatar}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primaryTypographyProps={{
                      color: "secondary",
                      variant: "subtitle2",
                    }}
                    primary={course.name}
                    secondary={course.description}
                    className={classes.listText}
                  />
                </ListItem>
                <Divider />
              </>
            );
          })}
        </List>
      </Paper>
    </Container>
  );
};

export default MyCourses;
