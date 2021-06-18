import React, { useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { Form, Formik } from "formik";
import { createLesson } from "./api-course";
import { isAuthenticated } from "../Auth/auth-helpers";
import * as Yup from "yup";
import Input from "../../utils/Input";

const initialValues = {
  title: "",
  content: "",
  resourceUrl: "",
};

const validationSchema = Yup.object().shape({
  title: Yup.string().required().trim(),
  content: Yup.string().required().trim(),
  resourceUrl: Yup.string().url().required().trim(),
});

const useStyles = makeStyles((theme) => ({
  form: {
    minWidth: 500,
    textAlign: "center",
  },
  textField: {
    width: 400,
    "& .MuiInputBase-root, & .MuiFormLabel-root": {
      padding: theme.spacing(0, 1),
    },
  },
  button: {
    height: 45,
    borderRadius: 50,
  },
  submit: {
    width: 150,
    margin: "auto",
    marginBottom: theme.spacing(2),
  },
  dialogActions: {
    marginTop: theme.spacing(2),
  },
}));

const CreateLesson = ({ courseId, addLesson }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleSubmit = (values, errors) => {
    createLesson(
      {
        courseId: courseId,
      },
      {
        jwt: isAuthenticated().token,
      },
      values
    ).then((data) => {
      if (data?.status === "error") {
        data.errors && errors.setErrors(data.errors);
        return;
      }

      if (data?.status === "success") {
        addLesson(data.course);
        errors.resetForm();
        setOpen(false);
        return;
      }
    });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button
        aria-label="Add Lesson"
        color="primary"
        variant="contained"
        onClick={handleClickOpen}
        className={classes.button}
        startIcon={<Add />}
      >
        &nbsp; New Lesson
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <div className={classes.form}>
          <DialogTitle id="form-dialog-title">Add New Lesson</DialogTitle>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <Form>
              <DialogContent>
                {/* Title Lesson Field  */}
                <Input
                  name="title"
                  label="Title :"
                  fullWidth
                  required
                  classes={{ root: classes.textField }}
                />

                {/* Content Lesson Field  */}
                <Input
                  name="content"
                  label="Content :"
                  multiline
                  rows={3}
                  fullWidth
                  required
                  classes={{ root: classes.textField }}
                />

                {/* ResourceUrl Lesson Field  */}
                <Input
                  name="resourceUrl"
                  label="Resource link :"
                  type="url"
                  fullWidth
                  required
                  classes={{ root: classes.textField }}
                />
              </DialogContent>

              <DialogActions className={classes.dialogActions}>
                <Button
                  onClick={handleClose}
                  color="primary"
                  variant="contained"
                  className={clsx(classes.button, classes.submit)}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  color="secondary"
                  variant="contained"
                  className={clsx(classes.button, classes.submit)}
                >
                  Add
                </Button>
              </DialogActions>
            </Form>
          </Formik>
        </div>
      </Dialog>
    </div>
  );
};

CreateLesson.propTypes = {
  courseId: PropTypes.string.isRequired,
  addLesson: PropTypes.func.isRequired,
};

export default CreateLesson;
