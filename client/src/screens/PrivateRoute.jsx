import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "@/components/Auth/auth-helpers";

const PrivateRoute = ({ component: Component, ...props }) =>
  isAuthenticated() ? <Component {...props} /> : <Navigate to="/signin" />;

PrivateRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
};

export default PrivateRoute;
