import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Users from "./components/Users";
import Profile from "./components/Users/Profile";
import EditProfile from "./components/Users/EditProfile";
import Signup from "./components/Auth/Signup";
import Signin from "./components/Auth/Signin";
import PrivateRoute from "./PrivateRoute";
import CreateCourse from "./components/Courses/CreateCourse";
import MyCourses from "./components/Courses/MyCourses";
import Course from "./components/Courses/Course";
import EditCourse from "./components/Courses/EditCourse";
import Enrollment from "./components/Enrollment";
import NotFound from "./components/NotFound";
import { Box } from "@material-ui/core";

const MainRoutes = () => {
  return (
    <Box mt={14}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<Users />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <PrivateRoute path="/user/:userId" component={Profile} />
        <PrivateRoute path="/user/edit/:userId" component={EditProfile} />
        <Route path="/course/:courseId" element={<Course />} />

        <PrivateRoute path="/teach/courses" component={MyCourses} />
        <PrivateRoute path="/teach/course/create" component={CreateCourse} />
        <PrivateRoute
          path="/teach/course/edit/:courseId"
          component={EditCourse}
        />
        <PrivateRoute path="/teach/course/:courseId" component={Course} />
        <PrivateRoute path="/learn/:enrollmentId" component={Enrollment} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Box>
  );
};

export default MainRoutes;
