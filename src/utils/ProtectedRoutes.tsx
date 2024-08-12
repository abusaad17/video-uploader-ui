import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
  const localStorageToken = localStorage.getItem("token");

  return localStorageToken ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoutes;
