import { useEffect, useState } from "react";
import { Card, Typography, styled } from "@mui/material";
import { listEnrolled } from "@/components/Enrollment/api-enrollment";
import { isAuthenticated } from "@/components/Auth/auth-helpers";
import { listPublished } from "@/components/Course/api-course";
import EnrollmentList from "@/components/Enrollment/List";
import CourseList from "@/components/Course/List";
import { useTheme } from "@emotion/react";

const StyledCard = styled(Card)(({ theme }) => ({
  width: "90%",
  margin: "auto",
  marginTop: "20px",
  marginBottom: theme.spacing(2),
  padding: "20px",
  boxShadow: "0px 0px 0px 1px rgb(140 140 140/.2)",
}));

const StyledNoTitle = styled(Typography)({
  color: "lightgrey",
});

const ScreensHome = () => {
  const theme = useTheme();
  const [courses, setCourses] = useState([]);
  const [enrolled, setEnrolled] = useState([]);

  useEffect(() => {
    document.title = "Home";
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    listEnrolled({ jwt: isAuthenticated().token }, signal).then((data) => {
      if (data?.status === "error") {
        console.log(data.error);
        return;
      }

      if (data?.status === "success") {
        setEnrolled(data.enrollments);
        return;
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    listPublished(signal).then((data) => {
      if (data?.status === "error") {
        return;
      }

      if (data?.status === "success") {
        setCourses(data.courses);
        return;
      }
    });

    return function cleanup() {
      abortController.abort();
    };
  }, []);

  return (
    <>
      {isAuthenticated().user && (
        <StyledCard
          sx={{
            backgroundColor: "#616161",
          }}
          elevation={0}
        >
          <Typography variant="h6" component="h2" color="#efefef">
            Courses you are enrolled in
          </Typography>
          {enrolled.length !== 0 ? (
            <EnrollmentList enrollments={enrolled} />
          ) : (
            <StyledNoTitle variant="body1">No courses.</StyledNoTitle>
          )}
        </StyledCard>
      )}

      <StyledCard elevation={0}>
        <Typography variant="h6" component="h2" color={theme.palette.openTitle}>
          All Courses
        </Typography>
        {courses.length !== 0 && courses.length !== enrolled.length ? (
          <CourseList courses={courses} common={enrolled} />
        ) : (
          <StyledNoTitle variant="body1">No new courses.</StyledNoTitle>
        )}
      </StyledCard>
    </>
  );
};

export default ScreensHome;
