import AuthBase from "@/components/Auth/Base";
import AuthFormSignup from "@/components/Auth/Form/Signup";
import { signup } from "@/components/Auth/api-auth";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import * as Yup from "yup";

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

const ScreensSignup = () => {
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Sign Up";
  }, []);

  const handleSubmit = async (values, errors) => {
    setLoading(true);

    const data = await signup(values);

    if (data?.status === "error") {
      data.message = data.message || (data.errors && "Validation error.");

      setMessage(data.message);

      data.errors && errors.setErrors(data.errors);
    }

    if (data?.status === "success") {
      setOpen(true);
    }

    setLoading(false);
  };

  return (
    <>
      <AuthBase
        title="Sign Up"
        initialValues={initialValues}
        validationSchema={validationSchema}
        handleSubmit={handleSubmit}
      >
        <AuthFormSignup message={message} loading={loading} />
      </AuthBase>

      <Dialog open={open}>
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
            component={NavLink}
            to="/signin"
          >
            Sign In
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ScreensSignup;
