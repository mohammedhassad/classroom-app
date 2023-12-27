import { useState } from "react";
import PropTypes from "prop-types";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { deleteCourse } from "./api-course";
import { isAuthenticated } from "@/components/Auth/auth-helpers";
import { useNavigate } from "react-router";

const CourseDelete = ({ course }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleDeleteCourse = () => {
    deleteCourse(
      { courseId: course._id },
      { jwt: isAuthenticated().token }
    ).then((data) => {
      if (data?.status === "error") {
        return;
      }

      if (data?.status === "success") {
        setOpen(false);
        return navigate("/teach/courses");
      }
    });
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box as="span">
      <IconButton aria-label="Delete" onClick={handleOpen} color="secondary">
        <DeleteIcon />
      </IconButton>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{`Delete ${course.name}`}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Confirm to delete your course {course.name}.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteCourse}
            color="secondary"
            autoFocus="autoFocus"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

CourseDelete.propTypes = {
  course: PropTypes.object.isRequired,
};

export default CourseDelete;
