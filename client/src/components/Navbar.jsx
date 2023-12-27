import {
  AppBar,
  Button,
  IconButton,
  Stack,
  Toolbar,
  Typography,
  styled,
} from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import Library from "@mui/icons-material/LocalLibrary";
import HomeIcon from "@mui/icons-material/Home";
import { isAuthenticated, clearJWT } from "@/components/Auth/auth-helpers";

const StyledTeachButton = styled(Button)({
  color: "#fffde7",
  backgroundColor: "#f57c00",
  marginRight: 10,

  "&:hover": {
    backgroundColor: "#f57c00",
  },

  "&.active": {
    color: "#616161",
    backgroundColor: "#fffde7",
    border: "1px solid #f57c00",
  },
});

const StyledNavLink = styled(Button)(({ theme }) => ({
  color: "#fffde7",
  minWidth: 75,
  fontWeight: theme.typography.fontWeightRegular,

  "&.active": {
    color: "#f57c00",
  },
}));

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        zIndex: 2000,
      }}
    >
      <Toolbar>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="h6" color="inherit">
            Classroom
          </Typography>
          <IconButton
            disableRipple
            component={NavLink}
            to="/"
            end
            sx={{
              color: "#fffde7",

              "&.active": {
                color: "#f57c00",
              },
            }}
          >
            <HomeIcon />
          </IconButton>
        </Stack>

        {/* items */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          flexGrow={1}
        >
          {isAuthenticated().user ? (
            <>
              {isAuthenticated().user.educator && (
                <StyledTeachButton
                  disableRipple
                  variant="default"
                  component={NavLink}
                  to="/teach/courses"
                  startIcon={<Library />}
                >
                  Teach
                </StyledTeachButton>
              )}
              <StyledNavLink
                disableRipple
                component={NavLink}
                to={`/user/${isAuthenticated().user._id}`}
              >
                My Profile
              </StyledNavLink>
              <StyledNavLink
                disableRipple
                onClick={() => {
                  clearJWT(() => navigate("/"));
                }}
              >
                Sign out
              </StyledNavLink>
            </>
          ) : (
            <>
              <StyledNavLink disableRipple component={NavLink} to="/signup">
                Sign up
              </StyledNavLink>
              <StyledNavLink disableRipple component={NavLink} to="/signin">
                Sign in
              </StyledNavLink>
            </>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
