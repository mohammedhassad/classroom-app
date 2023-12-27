import Input from "@/components/UI/Input";
import { LoadingButton } from "@mui/lab";
import { Alert, Box, Stack } from "@mui/material";
import PropTypes from "prop-types";

const AuthFormSignin = ({ message, loading }) => {
  return (
    <Stack alignItems="center" width="80%" mx="auto">
      <Box width="100%">
        <Alert
          variant="filled"
          severity={message ? "error" : "info"}
          sx={{
            fontWeight: 400,
            textAlign: "start",
          }}
        >
          {message ? (
            message
          ) : (
            <>
              Use <strong>demo@example.com</strong> and{" "}
              <strong>unsafepassword</strong> to sign in
            </>
          )}
        </Alert>
      </Box>

      <Stack width="100%" alignItems="center" spacing={2} mt={4}>
        <Input
          name="email"
          type="email"
          label="Email Addresse :"
          required
          fullWidth
        />

        <Input
          name="password"
          type="password"
          label="Password :"
          required
          fullWidth
        />

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
          Sign In
        </LoadingButton>
      </Stack>
    </Stack>
  );
};

AuthFormSignin.propTypes = {
  message: PropTypes.string,
  loading: PropTypes.bool,
};

export default AuthFormSignin;
