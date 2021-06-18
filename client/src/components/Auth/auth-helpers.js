// import { signout } from "./api-auth";

const authenticate = (jwt, cb) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("jwt", JSON.stringify(jwt));
  }

  cb();
};

const isAuthenticated = () => {
  if (typeof window == "undefined") return false;

  if (localStorage.getItem("jwt"))
    return JSON.parse(localStorage.getItem("jwt"));
  else return false;
};

const clearJWT = (cb) => {
  if (typeof window !== "undefined") localStorage.removeItem("jwt");
  cb();
};

export { authenticate, isAuthenticated, clearJWT };
