import AuthBase from "@/components/Auth/Base";
import AuthFormSignin from "@/components/Auth/Form/Signin";
import { signin } from "@/components/Auth/api-auth";
import { authenticate } from "@/components/Auth/auth-helpers";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  email: Yup.string().email().required(),
  password: Yup.string().required(),
});

const initialValues = {
  email: "demo@example.com",
  password: "unsafepassword",
};

const ScreensSignin = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Sign In";
  }, []);

  const handleSubmit = async (values, errors) => {
    setLoading(true);

    const data = await signin(values);

    if (data?.status === "error") {
      data.message = data.message || (data.errors && "Validation error.");

      setMessage(data.message);

      data.errors && errors.setErrors(data.errors);
    }

    if (data?.status === "success") {
      authenticate(data, () => {
        navigate("/");
      });
    }

    setLoading(false);
  };

  return (
    <AuthBase
      title="Sign In"
      initialValues={initialValues}
      validationSchema={validationSchema}
      handleSubmit={handleSubmit}
    >
      <AuthFormSignin message={message} loading={loading} />
    </AuthBase>
  );
};

export default ScreensSignin;
