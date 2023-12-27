import Input from "@/components/UI/Input";
import ArrowUp from "@mui/icons-material/ArrowUpward";
import DeleteIcon from "@mui/icons-material/Delete";
import { Avatar, Box, IconButton, Stack } from "@mui/material";
import PropTypes from "prop-types";

const CourseLessonCard = ({ remove, move, lessons, published }) => {
  return (
    <Box>
      {lessons?.map((lesson, index) => {
        return (
          <Box key={index} mb={2}>
            <Stack direction="row" alignItems="center" bgcolor="#f3f3f3" p={3}>
              <Stack alignItems="center" spacing={1}>
                <Avatar>{index + 1}</Avatar>
                {index !== 0 && (
                  <IconButton
                    aria-label="up"
                    color="primary"
                    onClick={() => move(index, index - 1)}
                    sx={{
                      border: "2px solid #f57c00",
                      padding: "4px",
                    }}
                  >
                    <ArrowUp />
                  </IconButton>
                )}
              </Stack>

              <Stack mx={2} flex={1} spacing={2}>
                {/* Title Course Field */}
                <Input
                  name={`lessons.${index}.title`}
                  label="Title :"
                  required
                  fullWidth
                />

                {/* Content Course Field */}
                <Input
                  name={`lessons.${index}.content`}
                  label="Content :"
                  required
                  fullWidth
                  multiline
                  rows="5"
                />

                {/* ResourceUrl Course Field */}
                <Input
                  name={`lessons.${index}.resourceUrl`}
                  label="Resource Link :"
                  required
                  fullWidth
                />
              </Stack>

              {published && (
                <IconButton
                  edge="end"
                  aria-label="up"
                  color="primary"
                  onClick={() => remove(index)}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </Stack>
          </Box>
        );
      })}
    </Box>
  );
};

CourseLessonCard.propTypes = {
  remove: PropTypes.func,
  move: PropTypes.func,
  lessons: PropTypes.array,
  published: PropTypes.bool,
  classes: PropTypes.object,
};

export default CourseLessonCard;
