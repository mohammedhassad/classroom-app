import { Card } from "@mui/material";
import { useEffect } from "react";
import UserFormEdit from "@/components/User/Form/Edit.jsx";

const ScreensUserEdit = () => {
  useEffect(() => {
    document.title = "Edit Profile";
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
      <UserFormEdit />
    </Card>
  );
};

export default ScreensUserEdit;
