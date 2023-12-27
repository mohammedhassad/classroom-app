import { isAuthenticated } from "@/components/Auth/auth-helpers";
import { listByInstructor } from "@/components/Course/api-course";
import AddBoxIcon from "@mui/icons-material/AddBox";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const ScreensMyCourses = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    document.title = "My Courses";
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    listByInstructor(
      {
        userId: isAuthenticated().user._id,
      },
      { jwt: isAuthenticated().token },
      signal
    ).then((data) => {
      if (data?.status === "error") {
        return navigate("/signin");
      }

      if (data?.status === "success") {
        return setCourses(data.courses);
      }
    });

    return function cleanup() {
      abortController.abort();
    };
  }, [navigate]);

  return (
    <Card
      sx={{
        maxWidth: 900,
        margin: "auto",
        boxShadow: "0px 0px 0px 1px rgb(140 140 140/.2)",
      }}
    >
      <CardHeader
        title={
          <Typography
            sx={{
              color: theme.palette.openTitle,
              fontSize: "1.2em",
              fontWeight: 500,
            }}
          >
            Your Courses
          </Typography>
        }
        action={
          <Box as="span">
            <Link to="/teach/course/create">
              <Button
                color="primary"
                variant="contained"
                startIcon={<AddBoxIcon />}
              >
                New Course
              </Button>
            </Link>
          </Box>
        }
        sx={{
          p: theme.spacing(4),
          pb: 0,
        }}
      />

      <CardContent sx={{ p: theme.spacing(4) }}>
        <List>
          {courses.map((course, index) => {
            return (
              <>
                <ListItemButton
                  component={Link}
                  to={"/teach/course/" + course._id}
                  key={index}
                >
                  <ListItemAvatar>
                    <Avatar
                      src={
                        "/api/courses/photo/" +
                        course._id +
                        "?" +
                        new Date().getTime()
                      }
                      sx={{
                        borderRadius: 0,
                        width: "150px",
                        height: "100px",
                      }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primaryTypographyProps={{
                      color: "secondary",
                      variant: "subtitle2",
                    }}
                    primary={course.name}
                    secondary={course.description}
                    sx={{
                      marginLeft: "16px",
                    }}
                  />
                </ListItemButton>
                <Divider />
              </>
            );
          })}
        </List>
      </CardContent>
    </Card>
  );
};

export default ScreensMyCourses;
