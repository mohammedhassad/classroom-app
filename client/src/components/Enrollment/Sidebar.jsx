import PropTypes from "prop-types";
import { CheckCircle, Info } from "@mui/icons-material";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader,
  Stack,
  useTheme,
} from "@mui/material";

const EnrollmentSidebar = ({
  selectDrawer,
  values,
  enrollment,
  totalComplete,
}) => {
  const theme = useTheme();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: "300px",
        boxShadow: "0px 0px 0px 1px rgb(140 140 140/.2)",

        "& .MuiDrawer-paper": {
          width: "300px",
        },
      }}
    >
      <Box
        sx={{
          ...theme.mixins.toolbar,
        }}
      />

      <Stack height="100%" divider={<Divider />}>
        <List>
          <ListItemButton
            onClick={selectDrawer(-1)}
            sx={{
              backgroundColor: "#ffffff",

              "&.Mui-selected": {
                backgroundColor: "#e9e3df",
              },

              "&:hover, &.Mui-selected:hover": {
                backgroundColor: "#e9e3df",
              },
            }}
            selected={values?.drawer === -1}
          >
            <ListItemIcon>
              <Info />
            </ListItemIcon>
            <ListItemText primary="Course Overview" />
          </ListItemButton>
        </List>

        <Box flexGrow={1} overflowY="auto">
          <List>
            <ListSubheader
              component="div"
              sx={{
                margin: "10px",
                color: theme.palette.openTitle,
              }}
            >
              Lessons
            </ListSubheader>
            {enrollment.lessonStatus.map((lesson, index) => (
              <ListItemButton
                key={index}
                onClick={selectDrawer(index)}
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "#e9e3df",
                  },

                  "&:hover, &.Mui-selected:hover": {
                    backgroundColor: "#e9e3df",
                  },
                }}
                selected={values?.drawer === index}
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      color: "#9b9b9b",
                      border: "1px solid #bdbdbd",
                      background: "none",
                    }}
                  >
                    {index + 1}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={enrollment?.course?.lessons[index]?.title}
                />
                <ListItemSecondaryAction>
                  {lesson.complete ? (
                    <CheckCircle
                      sx={{
                        color: "#38cc38",
                      }}
                    />
                  ) : (
                    <RadioButtonUncheckedIcon />
                  )}
                </ListItemSecondaryAction>
              </ListItemButton>
            ))}
          </List>
        </Box>

        <List>
          <ListItem>
            <ListItemText
              primary={
                <Box
                  sx={{
                    textAlign: "center",

                    color: "#9b9b9b",

                    "& span": {
                      color: theme.palette.openTitle,
                      fontSize: "1.15em",
                    },
                  }}
                >
                  <span>{totalComplete}</span> out of{" "}
                  <span>{enrollment?.lessonStatus?.length}</span> completed
                </Box>
              }
            />
          </ListItem>
        </List>
      </Stack>
    </Drawer>
  );
};

EnrollmentSidebar.propTypes = {
  selectDrawer: PropTypes.func.isRequired,
  values: PropTypes.array.isRequired,
  enrollment: PropTypes.object.isRequired,
  totalComplete: PropTypes.string.isRequired,
};

export default EnrollmentSidebar;
