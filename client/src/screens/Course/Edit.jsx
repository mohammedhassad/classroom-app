import CourseFormEdit from "@/components/Course/Form/Edit";
import { Card } from "@mui/material";
import { useEffect } from "react";

const ScreensCourseEdit = () => {
  useEffect(() => {
    document.title = "Edit Course";
  }, []);

  return (
    <Card
      sx={{
        maxWidth: 1000,
        mx: "auto",
        padding: "24px 40px 40px",
        boxShadow: "0px 0px 0px 1px rgb(140 140 140/.2)",
      }}
      elevation={0}
    >
      <CourseFormEdit />
    </Card>
  );
};

export default ScreensCourseEdit;
