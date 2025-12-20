import React from "react"
import { useAuth } from "./AuthContext"
import { Route, Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    const { isAuthenticated, isVerified } = useAuth();
    console.log("isverified", isVerified);

    return isAuthenticated ? (isVerified?<Outlet />:<Navigate to="/verify_phone" replace/>) : <Navigate to="/login" replace/>;
};

export default ProtectedRoute;