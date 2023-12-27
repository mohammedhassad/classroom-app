import { getUsers } from "@/components/User/api-user";
import { ArrowForward, Person } from "@mui/icons-material";
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ScreensUserList = () => {
  const theme = useTheme();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    document.title = "List Users";
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    getUsers(signal).then((data) => {
      if (data.status === "error") {
        return;
      }

      if (data.status === "success") {
        setUsers(data.users);
        return;
      }
    });

    return function cleanUp() {
      abortController.abort();
    };
  }, []);

  return (
    <Card
      sx={{
        maxWidth: 600,
        margin: "auto",
        boxShadow: "0px 0px 0px 1px rgb(140 140 140/.2)",
      }}
    >
      <CardHeader
        title={
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.openTitle,
            }}
          >
            All Users
          </Typography>
        }
        sx={{
          pb: 0,
        }}
      />

      <CardContent>
        <List>
          {users?.map((user, index) => (
            <ListItem
              component={Link}
              to={"/user/" + user._id}
              key={index}
              sx={{
                textDecoration: "none",
                textTransform: "Capitalize",
                color: theme.palette.common.black,

                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              <ListItemAvatar>
                <Avatar>
                  <Person />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={user.name} />
              <ListItemSecondaryAction>
                <IconButton component={Link} to={"/user/" + user._id}>
                  <ArrowForward />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default ScreensUserList;
