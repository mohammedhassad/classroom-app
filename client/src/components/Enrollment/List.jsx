import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import CompletedIcon from "@mui/icons-material/VerifiedUser";
import InProgressIcon from "@mui/icons-material/DonutLarge";
import { Box, ImageList, ImageListItem, ImageListItemBar } from "@mui/material";

const EnrollmentList = ({ enrollments }) => {
  return (
    <ImageList
      rowHeight={200}
      cols={4}
      gap={10}
      sx={{
        width: "100%",
        padding: "12px 0 10px",
        overflow: "unset",
      }}
    >
      {enrollments.map((course, i) => (
        <ImageListItem
          key={i}
          sx={{
            height: "100%",
            width: "100%",
            textAlign: "center",
          }}
        >
          <Box as={Link} to={"/learn/" + course._id} height="100%" width="100%">
            <Box
              as="img"
              src={"/api/courses/photo/" + course.course._id}
              alt={course.course.name}
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
                to={"/learn/" + course._id}
                sx={{
                  fontSize: "1.1em",
                  marginBottom: "5px",
                  color: "#fffde7",
                  display: "block",
                }}
              >
                {course.course.name}
              </Box>
            }
            actionIcon={
              <Box mx="10px">
                {course.completed ? (
                  <CompletedIcon color="secondary" />
                ) : (
                  <InProgressIcon
                    sx={{
                      color: "#b4f8b4",
                    }}
                  />
                )}
              </Box>
            }
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
};

EnrollmentList.propTypes = {
  enrollments: PropTypes.array.isRequired,
};

export default EnrollmentList;
