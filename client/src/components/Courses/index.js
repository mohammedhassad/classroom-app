import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  GridList,
  GridListTile,
  GridListTileBar,
  Button,
} from "@material-ui/core";
import Enroll from "../Enrollment/Enroll";
import { isAuthenticated } from "../Auth/auth-helpers";

const useStyles = makeStyles((theme) => ({
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
    padding: "16px 0 0px",
  },
  tile: {
    textAlign: "center",
    border: "1px solid #cecece",
    backgroundColor: "#04040c",
  },
  image: {
    height: "100%",
  },
  tileBar: {
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    textAlign: "left",
  },
  tileTitle: {
    fontSize: "1.1em",
    marginBottom: "5px",
    color: "#fffde7",
    display: "block",
  },
  action: {
    margin: "0 10px",
  },
}));

const Courses = ({ courses, common }) => {
  const classes = useStyles();

  const findCommon = (course) => {
    return !common.find((enrolled) => {
      return enrolled.course._id === course._id;
    });
  };

  return (
    <GridList cellHeight={220} className={classes.gridList} cols={2}>
      {courses.map((course, index) => {
        return (
          findCommon(course) && (
            <GridListTile
              className={classes.tile}
              key={index}
              style={{ padding: 0 }}
            >
              <Link to={"/course/" + course._id}>
                <img
                  className={classes.image}
                  src={"/api/courses/photo/" + course._id}
                  alt={course.name}
                />
              </Link>
              <GridListTileBar
                className={classes.tileBar}
                title={
                  <Link
                    to={"/course/" + course._id}
                    className={classes.tileTitle}
                  >
                    {course.name}
                  </Link>
                }
                subtitle={<span>{course.category}</span>}
                actionIcon={
                  <div className={classes.action}>
                    {isAuthenticated() ? (
                      <Enroll courseId={course._id} />
                    ) : (
                      <Link to="/signin" style={{ textDecoration: "none" }}>
                        <Button variant="contained" color="secondary">
                          Sign in to Enroll
                        </Button>
                      </Link>
                    )}
                  </div>
                }
              />
            </GridListTile>
          )
        );
      })}
    </GridList>
  );
};

Courses.propTypes = {
  courses: PropTypes.array.isRequired,
};

export default Courses;
