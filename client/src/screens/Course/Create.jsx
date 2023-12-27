import CourseFormCreate from "@/components/Course/Form/Create";
import { Card } from "@mui/material";
import { useEffect } from "react";

const ScreensCourseCreate = () => {
  useEffect(() => {
    document.title = "Create Course";
  }, []);

  return (
    <Card
      sx={{
        maxWidth: 600,
        margin: "auto",
        textAlign: "center",
        boxShadow: "0px 0px 0px 1px rgb(140 140 140/.2)",
      }}
      elevation={0}
    >
      <CourseFormCreate />
    </Card>
  );
};

export default ScreensCourseCreate;
