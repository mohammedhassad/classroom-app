import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  ImageList,
  Button,
  ImageListItemBar,
  ImageListItem,
  Box,
} from "@mui/material";
import EnrollmentButton from "@/components/Enrollment/Button";
import { isAuthenticated } from "@/components/Auth/auth-helpers";

const CourseList = ({ courses, common }) => {
  const findCommon = (course) => {
    return !common.find((enrolled) => {
      return enrolled.course._id === course._id;
    });
  };

  return (
    <ImageList
      rowHeight={300}
      cols={2}
      gap={10}
      sx={{
        width: "100%",
        padding: "16px 0 0px",
        overflow: "unset",
      }}
    >
      {courses.map((course, index) => {
        return (
          findCommon(course) && (
            <ImageListItem
              key={index}
              sx={{
                height: "100%",
                width: "100%",
                textAlign: "center",
                border: "1px solid #cecece",
                backgroundColor: "#04040c",
              }}
            >
              <Box
                as={Link}
                to={"/course/" + course._id}
                height="100%"
                width="100%"
              >
                <Box
                  as="img"
                  src={"/api/courses/photo/" + course._id}
                  alt={course.name}
                  sx={{
                    height: "100%",
                    width: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                  }}
                />
              </Box>

              <ImageListItemBar
                sx={{
                  backgroundColor: "rgba(0, 0, 0, 0.85)",
                  textAlign: "left",
                }}
                title={
                  <Box
                    as={Link}
                    to={"/course/" + course._id}
                    sx={{
                      fontSize: "1.1em",
                      marginBottom: "5px",
                      color: "#fffde7",
                      display: "block",
                    }}
                  >
                    {course.name}
                  </Box>
                }
                subtitle={<span>{course.category}</span>}
                actionIcon={
                  <Box mx="10px">
                    {isAuthenticated() ? (
                      <EnrollmentButton courseId={course._id} />
                    ) : (
                      <Link to="/signin" style={{ textDecoration: "none" }}>
                        <Button variant="contained" color="secondary">
                          Sign in to Enroll
                        </Button>
                      </Link>
                    )}
                  </Box>
                }
              />
            </ImageListItem>
          )
        );
      })}
    </ImageList>
  );
};

CourseList.propTypes = {
  courses: PropTypes.array.isRequired,
  common: PropTypes.array.isRequired,
};

export default CourseList;
