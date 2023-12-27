import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  useTheme,
} from "@mui/material";
import { Form, Formik } from "formik";
import PropTypes from "prop-types";

const AuthBase = ({
  title,
  initialValues,
  validationSchema,
  handleSubmit,
  children,
}) => {
  const theme = useTheme();

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
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          <CardHeader
            title={
              <Typography
                variant="h6"
                sx={{
                  color: theme.palette.openTitle,
                }}
              >
                {title}
              </Typography>
            }
            sx={{
              pb: 0,
            }}
          />

          <CardContent>{children}</CardContent>
        </Form>
      </Formik>
    </Card>
  );
};

AuthBase.propTypes = {
  title: PropTypes.string.isRequired,
  initialValues: PropTypes.object.isRequired,
  validationSchema: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default AuthBase;
