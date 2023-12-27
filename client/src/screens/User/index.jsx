import { Edit, Person } from "@mui/icons-material";
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { isAuthenticated } from "@/components/Auth/auth-helpers";
import UserDelete from "@/components/User/Delete";
import { getUser } from "@/components/User/api-user";

const ScreensUser = () => {
  const theme = useTheme();
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({});

  useEffect(() => {
    document.title = "Profile";
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    getUser({ userId }, { jwt: isAuthenticated().token }, signal).then(
      (data) => {
        if (data?.status === "error") {
          navigate("/signin");
          return;
        }

        if (data?.status === "success") {
          setUser(data.user);
          return;
        }
      }
    );
  }, [userId, navigate]);

  return (
    <Card
      sx={{
        maxWidth: 600,
        mx: "auto",
        boxShadow: "0px 0px 0px 1px rgb(140 140 140/.2)",
      }}
      elevation={0}
    >
      <CardHeader
        title={
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.openTitle,
            }}
          >
            Profile
          </Typography>
        }
        sx={{
          pb: 0,
        }}
      />

      <CardContent>
        <List dense>
          <Stack
            divider={<Divider sx={{ width: "95%", mx: "auto !important" }} />}
            spacing="4px"
          >
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <Person />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={user.name}
                secondary={user.email}
                sx={{
                  "& .MuiListItemText-primary": {
                    fontWeight: 700,
                    textTransform: "capitalize",
                  },
                }}
              />
              {isAuthenticated().user &&
                isAuthenticated().user._id === user._id && (
                  <ListItemSecondaryAction>
                    <Link to={"/user/edit/" + user._id}>
                      <IconButton aria-label="Edit" color="primary">
                        <Edit />
                      </IconButton>
                    </Link>
                    <UserDelete userId={user._id} />
                  </ListItemSecondaryAction>
                )}
            </ListItem>

            <ListItem>
              <ListItemText
                primary={"Joined: " + new Date(user.createdAt).toDateString()}
              />
            </ListItem>
          </Stack>
        </List>
      </CardContent>
    </Card>
  );
};

export default ScreensUser;
