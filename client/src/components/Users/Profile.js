import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
} from "@material-ui/core";
import { Edit, Person } from "@material-ui/icons";
import { isAuthenticated } from "../Auth/auth-helpers";
import { getUser } from "./api-user";
import DeleteUser from "./DeleteUser";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 600,
    margin: "auto",
    padding: theme.spacing(3),
    marginTop: theme.spacing(5),
  },
  title: {
    marginTop: theme.spacing(3),
    color: theme.palette.protectedTitle,
  },
}));

const Profile = () => {
  const classes = useStyles();
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
          // navigate("/signin");
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
    <Paper className={classes.root} elevation={4}>
      <Typography variant="h6" className={classes.title}>
        Profile
      </Typography>
      <List dense>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <Person />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={user.name} secondary={user.email} />
          {isAuthenticated().user && isAuthenticated().user._id === user._id && (
            <ListItemSecondaryAction>
              <Link to={"/user/edit/" + user._id}>
                <IconButton aria-label="Edit" color="primary">
                  <Edit />
                </IconButton>
              </Link>
              <DeleteUser userId={user._id} />
            </ListItemSecondaryAction>
          )}
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary={"Joined: " + new Date(user.createdAt).toDateString()}
          />
        </ListItem>
      </List>
    </Paper>
  );
};

export default Profile;
