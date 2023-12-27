import { clearJWT, isAuthenticated } from "@/components/Auth/auth-helpers";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteUser } from "./api-user";

const UserDelete = ({ userId }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleDelete = () => {
    setOpen(true);
  };

  const handleRequestClose = () => {
    setOpen(false);
  };

  const handleDeleteAccount = () => {
    deleteUser({ userId }, { jwt: isAuthenticated().token }).then((data) => {
      if (data?.status === "error") {
        return;
      }

      if (data?.status) {
        clearJWT(() => console.log("deleted"));
        return navigate("/");
      }
    });
  };

  return (
    <span>
      <IconButton aria-label="Delete" onClick={handleDelete} color="secondary">
        <DeleteIcon />
      </IconButton>

      <Dialog open={open} onClose={handleRequestClose}>
        <DialogTitle>{"Delete Account"}</DialogTitle>
        <DialogContent>
          <DialogContentText>Confirm to delete your account.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRequestClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteAccount}
            color="secondary"
            autoFocus="autoFocus"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </span>
  );
};

UserDelete.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default UserDelete;
