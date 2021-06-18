import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardContent,
  Typography,
  Button,
  CardActions,
  FormControlLabel,
  Switch,
  Box,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import * as Yup from "yup";
import { Field, Form, Formik } from "formik";
import { isAuthenticated, authenticate } from "../Auth/auth-helpers";
import { getUser, updateUser } from "./api-user";
import Input from "../../utils/Input";

const validationSchema = Yup.object().shape({
  name: Yup.string().required(),
  email: Yup.string().email().required(),
  educator: Yup.bool(),
});

let initialValues = {
  name: "",
  email: "",
  educator: false,
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

const EditProfile = () => {
  const classes = useStyles();
  const formikRef = useRef();
  const { userId } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  useEffect(() => {
    document.title = "Edit Profile";
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    getUser({ userId }, { jwt: isAuthenticated().token }, signal).then(
      (data) => {
        if (data?.status === "error") {
          console.log(data);
          return;
        }

        if (data?.status === "success" && formikRef.current) {
          formikRef.current.setFieldValue("name", data.user.name);
          formikRef.current.setFieldValue("email", data.user.email);
          formikRef.current.setFieldValue("educator", data.user.educator);
        }
      }
    );
  }, [userId]);

  const handleSubmit = (values, errors) => {
    updateUser({ userId }, { jwt: isAuthenticated().token }, values).then(
      (data) => {
        if (data && data.status === "error") {
          data.message = data.message || (data.errors && "Validation error.");

          setMessage(data.message);

          data.errors && errors.setErrors(data.errors);
          return;
        }

        if (data?.status === "success") {
          const jwt = Object.assign(
            {},
            JSON.parse(localStorage.getItem("jwt")),
            data
          );

          return authenticate(jwt, () => {
            navigate(`/user/${data.user._id}`);
          });
        }
      }
    );
  };

  const handleSwitch = (event, form) => {
    form.setFieldValue("educator", event.target.checked);
  };

  return (
    <Card className={classes.card}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        innerRef={formikRef}
      >
        <Form>
          <CardContent>
            <Typography variant="h6" className={classes.title}>
              Edit Profile
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
              type="name"
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

            <Typography variant="subtitle1" className={classes.subheading}>
              I am an Educator
            </Typography>

            <Field>
              {({ field, form, meta }) => (
                <FormControlLabel
                  control={
                    <Switch
                      classes={{
                        checked: classes.checked,
                        bar: classes.bar,
                      }}
                      checked={field.value.educator}
                      onChange={(event) => handleSwitch(event, form)}
                    />
                  }
                  label={field.value.educator ? "Yes" : "No"}
                />
              )}
            </Field>
          </CardContent>
          <CardActions>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              className={classes.button}
            >
              Save
            </Button>
          </CardActions>
        </Form>
      </Formik>
    </Card>
  );
};

export default EditProfile;
