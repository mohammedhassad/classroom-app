import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardContent,
  makeStyles,
  Typography,
  CardActions,
  Box,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { signin } from "./api-auth";
import { authenticate } from "./auth-helpers";
import Input from "../../utils/Input";

const validationSchema = Yup.object().shape({
  email: Yup.string().email().required(),
  password: Yup.string().required(),
});

const initialValues = {
  email: "",
  password: "",
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

const Signin = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  useEffect(() => {
    document.title = "Sign In";
  }, []);

  const handleSubmit = (values, errors) => {
    signin(values).then((data) => {
      if (data?.status === "error") {
        data.message = data.message || (data.errors && "Validation error.");

        setMessage(data.message);

        data.errors && errors.setErrors(data.errors);
        return;
      }

      if (data?.status === "success") {
        return authenticate(data, () => {
          navigate("/");
        });
      }
    });
  };

  return (
    <Card className={classes.card}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          <CardContent>
            <Typography variant="h6" className={classes.title}>
              Sign In
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

            <Input
              name="email"
              type="email"
              label="Email Addresse :"
              required
              classes={{ root: classes.textField }}
            />

            <Input
              name="password"
              type="password"
              label="Password :"
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
              Sign In
            </Button>
          </CardActions>
        </Form>
      </Formik>
    </Card>
  );
};

export default Signin;
