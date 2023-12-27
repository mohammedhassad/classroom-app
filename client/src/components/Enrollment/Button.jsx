import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { create } from "./api-enrollment";
import { isAuthenticated } from "@/components/Auth/auth-helpers";

const EnrollmentButton = ({ courseId }) => {
  const navigate = useNavigate();

  const handleEnroll = () => {
    create({ courseId: courseId }, { jwt: isAuthenticated().token }).then(
      (data) => {
        if (data?.status === "error") {
          navigate("/signin");
          return;
        }

        if (data?.status === "success") {
          return navigate(`/learn/${data.enrollment._id}`);
        }
      }
    );
  };

  return (
    <Button variant="contained" color="secondary" onClick={handleEnroll}>
      Enroll
    </Button>
  );
};

EnrollmentButton.propTypes = {
  courseId: PropTypes.string.isRequired,
};

export default EnrollmentButton;
