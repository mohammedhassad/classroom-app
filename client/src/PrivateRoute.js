import React from "react";
import { Route, Navigate } from "react-router-dom";
import { isAuthenticated } from "./components/Auth/auth-helpers";

const PrivateRoute = ({ component: Component, path, ...props }) => (
  <Route
    path={path}
    element={
      isAuthenticated() ? <Component {...props} /> : <Navigate to="/signin" />
    }
  />
);

export default PrivateRoute;
