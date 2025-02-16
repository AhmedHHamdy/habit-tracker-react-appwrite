import { Navigate, Outlet } from "react-router-dom"; // Correct import
import { account } from "../config/appwriteConfig";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthProvider";
import Navbar from "./Navbar";

export default function AuthRequired() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
