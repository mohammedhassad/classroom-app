import React from "react";
import clsx from "clsx";
import { NavLink, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
} from "@material-ui/core";
import Library from "@material-ui/icons/LocalLibrary";
import HomeIcon from "@material-ui/icons/Home";
import { makeStyles } from "@material-ui/core/styles";
import { isAuthenticated, clearJWT } from "../Auth/auth-helpers";

const useStyles = makeStyles((theme) => ({
  title: { flexGrow: 1 },
  tabItem: {
    minWidth: 90,
    textTransform: "Capitalize",
  },
  navLink: {
    color: "#fffde7",
    minWidth: 75,
    textTransform: "capitalize",
    fontWeight: theme.typography.fontWeightRegular,

    "&.active": {
      color: "#f57c00",
    },
  },
  teachButton: {
    color: "#fffde7",
    backgroundColor: "#f57c00",
    marginRight: 10,

    "&.active": {
      color: "#616161",
      backgroundColor: "#fffde7",
      border: "1px solid #f57c00",
    },
  },
  homeButton: {
    color: "#fffde7",
  },
}));

const Navbar = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  return (
    <AppBar position="fixed" style={{ zIndex: 12343455 }} elevation={0}>
      <Toolbar>
        <Typography variant="h6" color="inherit">
          MERN Classroom
        </Typography>

        <Box ml={2}>
          <IconButton
            disableRipple
            className={classes.homeButton}
            component={NavLink}
            to="/"
            end
          >
            <HomeIcon />
          </IconButton>
        </Box>

        <Box position="absolute" right={10}>
          {isAuthenticated().user ? (
            <>
              {isAuthenticated().user.educator && (
                <Button
                  disableRipple
                  className={clsx(classes.navLink, classes.teachButton)}
                  component={NavLink}
                  to="/teach/courses"
                  end
                >
                  <Library /> Teach
                </Button>
              )}
              <Button
                disableRipple
                className={classes.navLink}
                component={NavLink}
                to={`/user/${isAuthenticated().user._id}`}
                end
              >
                My Profile
              </Button>
              <Button
                disableRipple
                className={classes.navLink}
                onClick={() => {
                  clearJWT(() => navigate("/"));
                }}
              >
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Button
                disableRipple
                className={classes.navLink}
                component={NavLink}
                to="/signup"
                end
              >
                Sign up
              </Button>
              <Button
                disableRipple
                className={classes.navLink}
                component={NavLink}
                to="/signin"
                end
              >
                Sign in
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
