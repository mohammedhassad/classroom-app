import { useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { Form, Formik } from "formik";
import { createLesson } from "../api-course";
import { isAuthenticated } from "@/components/Auth/auth-helpers";
import * as Yup from "yup";
import Input from "@/components/UI/Input";
import { LoadingButton } from "@mui/lab";

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

const CourseLessonCreate = ({ courseId, addLesson }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values, errors) => {
    setLoading(true);

    const data = await createLesson(
      {
        courseId: courseId,
      },
      {
        jwt: isAuthenticated().token,
      },
      values
    );

    if (data?.status === "error") {
      data.errors && errors.setErrors(data.errors);
    }

    if (data?.status === "success") {
      addLesson(data.course);
      errors.resetForm();
      setOpen(false);
    }

    setLoading(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box>
      <Button
        aria-label="Add Lesson"
        color="primary"
        variant="contained"
        onClick={handleClickOpen}
        startIcon={<Add />}
      >
        &nbsp; New Lesson
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        sx={{
          "& .MuiDialog-paper": {
            maxWidth: "600px",
            width: "100%",
          },
        }}
      >
        <Box textAlign="center">
          <DialogTitle id="form-dialog-title">Add New Lesson</DialogTitle>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <Form>
              <DialogContent>
                <Stack alignItems="center" width="90%" mx="auto" spacing={2}>
                  {/* Title Lesson Field  */}
                  <Input
                    type="text"
                    name="title"
                    label="Title :"
                    fullWidth
                    required
                  />

                  {/* Content Lesson Field  */}
                  <Input
                    name="content"
                    label="Content :"
                    fullWidth
                    required
                    multiline
                    rows={3}
                  />

                  {/* ResourceUrl Lesson Field  */}
                  <Input
                    name="resourceUrl"
                    label="Resource link :"
                    type="url"
                    fullWidth
                    required
                  />
                </Stack>
              </DialogContent>

              <DialogActions sx={{ padding: "8px 24px 20px 24px" }}>
                <Stack
                  direction="row"
                  alignItems="center"
                  width="90%"
                  mx="auto"
                  spacing={3}
                >
                  <LoadingButton
                    loading={loading}
                    variant="contained"
                    color="primary"
                    type="submit"
                    sx={{
                      height: "45px",
                      width: "50%",
                    }}
                  >
                    Add
                  </LoadingButton>

                  <Button
                    onClick={handleClose}
                    color="primary"
                    variant="outlined"
                    sx={{
                      height: "45px",
                      width: "50%",
                    }}
                  >
                    Cancel
                  </Button>
                </Stack>
              </DialogActions>
            </Form>
          </Formik>
        </Box>
      </Dialog>
    </Box>
  );
};

CourseLessonCreate.propTypes = {
  courseId: PropTypes.string.isRequired,
  addLesson: PropTypes.func.isRequired,
};

export default CourseLessonCreate;
