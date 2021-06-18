import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { isAuthenticated, clearJWT } from "../Auth/auth-helpers";
import { deleteUser } from "./api-user";

const DeleteUser = ({ userId }) => {
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

export default DeleteUser;
