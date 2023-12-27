import { authenticate, isAuthenticated } from "@/components/Auth/auth-helpers";
import Input from "@/components/UI/Input";
import { getUser, updateUser } from "@/components/User/api-user";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Box,
  CardContent,
  CardHeader,
  FormControlLabel,
  Stack,
  Switch,
  Typography,
  useTheme,
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";

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

const UserFormEdit = () => {
  const theme = useTheme();
  const formikRef = useRef();
  const { userId } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (values, errors) => {
    setLoading(true);

    const data = await updateUser(
      { userId },
      { jwt: isAuthenticated().token },
      values
    );

    if (data && data.status === "error") {
      data.message = data.message || (data.errors && "Validation error.");

      setMessage(data.message);

      data.errors && errors.setErrors(data.errors);
    }

    if (data?.status === "success") {
      const jwt = Object.assign(
        {},
        JSON.parse(localStorage.getItem("jwt")),
        data
      );

      authenticate(jwt, () => {
        navigate(`/user/${data.user._id}`);
      });
    }

    setLoading(false);
  };

  const handleSwitch = (event, form) => {
    form.setFieldValue("educator", event.target.checked);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      innerRef={formikRef}
    >
      <Form>
        <CardHeader
          title={
            <Typography
              variant="h6"
              sx={{
                color: theme.palette.openTitle,
              }}
            >
              Edit Profile
            </Typography>
          }
          sx={{
            pb: 0,
          }}
        />

        <CardContent>
          <Stack alignItems="center" width="80%" mx="auto">
            {message && (
              <Box mt={2} width="100%">
                <Alert
                  variant="filled"
                  severity="error"
                  sx={{
                    fontWeight: 400,
                    textAlign: "start",
                  }}
                  onClose={() => setMessage("")}
                >
                  {message}
                </Alert>
              </Box>
            )}

            <Stack width="100%" alignItems="center" spacing={2} mt={4}>
              <Input
                name="name"
                type="name"
                label="Name :"
                required
                fullWidth
              />

              <Input
                name="email"
                type="email"
                label="Email Addresse :"
                required
                fullWidth
              />

              <Box>
                <Typography variant="subtitle1">I am an Educator</Typography>

                <Field>
                  {({ field, form }) => (
                    <FormControlLabel
                      control={
                        <Switch
                          color="secondary"
                          checked={field.value.educator}
                          onChange={(event) => handleSwitch(event, form)}
                        />
                      }
                      label={field.value.educator ? "Yes" : "No"}
                    />
                  )}
                </Field>
              </Box>

              <LoadingButton
                loading={loading}
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
                sx={{
                  height: "45px",
                }}
              >
                Save
              </LoadingButton>
            </Stack>
          </Stack>
        </CardContent>
      </Form>
    </Formik>
  );
};

export default UserFormEdit;
