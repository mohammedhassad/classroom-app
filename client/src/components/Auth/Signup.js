import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Card,
  CardContent,
  makeStyles,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CardActions,
  Box,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { signup } from "./api-auth";
import Input from "../../utils/Input";

const validationSchema = Yup.object().shape({
  name: Yup.string().required(),
  email: Yup.string().email().required(),
  password: Yup.string().required(),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "passwords must match")
    .required("please confirm your password"),
});

const initialValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 600,
    margin: "auto",
    textAlign: "center",
    paddingBottom: theme.spacing(2),
  },
  title: {
    marginTop: theme.spacing(2),
    color: theme.palette.openTitle,
    // marginBottom: theme.spacing(5),
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 350,
    "& .MuiInputBase-root, & .MuiFormLabel-root": {
      padding: theme.spacing(0, 1),
    },
  },
  button: {
    margin: "auto",
    marginBottom: theme.spacing(2),
    height: 45,
    width: 350,
    borderRadius: 50,
  },
}));

const Signup = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    document.title = "Sign Up";
  }, []);

  const handleSubmit = (values, errors) => {
    signup(values).then((data) => {
      console.log(data);

      if (data?.status === "error") {
        data.message = data.message || (data.errors && "Validation error.");

        setMessage(data.message);

        data.errors && errors.setErrors(data.errors);
        return;
      }

      if (data?.status === "success") {
        return setOpen(true);
      }
    });
  };

  return (
    <div>
      <Card className={classes.card}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <CardContent>
              <Typography variant="h6" className={classes.title}>
                Sign Up
              </Typography>

              {message && (
                <Box my={2} mx={"auto"} width={350}>
                  <Alert
                    variant="filled"
                    severity="error"
                    onClose={() => setMessage("")}
                  >
                    {message}
                  </Alert>
                </Box>
              )}

              {/* textField for name */}
              <Input
                name="name"
                type="text"
                label="Name :"
                required
                classes={{ root: classes.textField }}
              />

              {/* textField for email */}
              <Input
                name="email"
                type="email"
                label="Email Addresse :"
                required
                classes={{ root: classes.textField }}
              />

              {/* textField for password */}
              <Input
                name="password"
                type="password"
                label="Password :"
                required
                classes={{ root: classes.textField }}
              />

              {/* textField for confirm password*/}
              <Input
                name="confirmPassword"
                type="password"
                label="Confirm Password :"
                required
                classes={{ root: classes.textField }}
              />
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                className={classes.button}
              >
                Sign Up
              </Button>
            </CardActions>
          </Form>
        </Formik>
      </Card>
      <Dialog open={open} disableBackdropClick={true}>
        <DialogTitle>New Account</DialogTitle>
        <DialogContent>
          <DialogContentText>
            New account successfully created.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            autoFocus="autoFocus"
            variant="contained"
            component={Link}
            to="/signin"
          >
            Sign In
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Signup;
