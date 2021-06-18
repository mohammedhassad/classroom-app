import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Button, Box } from "@material-ui/core";

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Page Not Found";
  }, []);

  return (
    <Box display="flex" justifyContent="center" mt={15}>
      <Box height="200px" width="400px">
        <Typography variant="h1" component="h1">
          404
        </Typography>
        <Typography component="p" variant="h4">
          Page not found
        </Typography>
        <Box mt="40px" display="flex" gridGap={10} width="100%">
          <Button
            variant="contained"
            color="primary"
            onClick={(e) => {
              navigate(-1);
              e.preventDefault();
            }}
          >
            Go Back
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={(e) => {
              navigate("/");
              e.preventDefault();
            }}
            style={{ color: "#fff" }}
          >
            Go to Home Page
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default NotFound;
