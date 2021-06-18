import React, { useState } from "react";
import PropTypes from "prop-types";
import DeleteIcon from "@material-ui/icons/Delete";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@material-ui/core";
import { deleteCourse } from "./api-course";
import { isAuthenticated } from "../Auth/auth-helpers";
import { useNavigate } from "react-router";

const DeleteCourse = ({ course }) => {
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
    <span>
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
    </span>
  );
};

DeleteCourse.propTypes = {
  course: PropTypes.object.isRequired,
};

export default DeleteCourse;
