import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
// This component checks if the user is authenticated by looking for a token in localStorage.