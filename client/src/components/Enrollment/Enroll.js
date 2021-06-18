import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { Button } from "@material-ui/core";
import { create } from "./api-enrollment";
import { isAuthenticated } from "../Auth/auth-helpers";

const Enroll = ({ courseId }) => {
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

Enroll.prototypes = {
  courseId: PropTypes.string.isRequired,
};

export default Enroll;
