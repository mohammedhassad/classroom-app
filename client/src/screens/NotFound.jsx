import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Button, Stack } from "@mui/material";

const ScreensNotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Page Not Found";
  }, []);

  return (
    <Stack
      display="flex"
      direction="column"
      alignItems="center"
      justifyContent="center"
    >
      <Stack height="200px" width="400px">
        <Typography variant="h1" component="h1">
          404
        </Typography>

        <Typography component="p" variant="h4">
          Page not found
        </Typography>

        <Stack mt="20px" display="flex" direction="row" spacing={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={(e) => {
              navigate("/");
              e.preventDefault();
            }}
          >
            Go to Home Page
          </Button>

          <Button
            color="primary"
            onClick={(e) => {
              navigate(-1);
              e.preventDefault();
            }}
          >
            Go Back
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default ScreensNotFound;
