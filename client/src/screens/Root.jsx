import ScreensSignin from "@/screens/Auth/Signin";
import ScreensSignup from "@/screens/Auth/Signup";
import ScreensEnrollment from "@/screens/Enrollment";
import ScreensHome from "@/screens/Home";
import ScreensNotFound from "@/screens/NotFound";
import ScreensCourse from "@/screens/Course";
import ScreensCourseCreate from "@/screens/Course/Create";
import ScreensCourseEdit from "@/screens/Course/Edit";
import ScreensMyCourses from "@/screens/Course/MyCourses";
import ScreensUserList from "@/screens/User/List";
import ScreensUserEdit from "@/screens/User/Edit";
import ScreensUser from "@/screens/User";
import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

const ScreensRoot = () => {
  return (
    <Routes>
      <Route path="/" element={<ScreensHome />} />
      <Route path="/users" element={<ScreensUserList />} />
      <Route path="/signin" element={<ScreensSignin />} />
      <Route path="/signup" element={<ScreensSignup />} />
      <Route path="/course/:courseId" element={<ScreensCourse />} />

      {/* Private Route */}
      <Route
        path="/user/:userId"
        element={<PrivateRoute component={ScreensUser} />}
      />
      <Route
        path="/user/edit/:userId"
        element={<PrivateRoute component={ScreensUserEdit} />}
      />
      <Route
        path="/learn/:enrollmentId"
        element={<PrivateRoute component={ScreensEnrollment} />}
      />
      <Route
        path="/teach/courses"
        element={<PrivateRoute component={ScreensMyCourses} />}
      />
      <Route
        path="/teach/course/create"
        element={<PrivateRoute component={ScreensCourseCreate} />}
      />
      <Route
        path="/teach/course/:courseId"
        element={<PrivateRoute component={ScreensCourse} />}
      />
      <Route
        path="/teach/course/edit/:courseId"
        element={<PrivateRoute component={ScreensCourseEdit} />}
      />

      <Route path="*" element={<ScreensNotFound />} />
    </Routes>
  );
};

export default ScreensRoot;
