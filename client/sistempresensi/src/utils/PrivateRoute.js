import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { isLogin } from "./AuthValidation";

const PrivateRoute = () => {
  return isLogin() ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
