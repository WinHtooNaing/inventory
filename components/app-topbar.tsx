"use client";
import React from "react";
import { UserNav } from "./user-nav";
import { useAuth } from "@/context/AuthContext";

const AppTopBar = () => {
  const { user } = useAuth();

  return (
    <div className="w-full flex justify-between items-center px-5">
      <h1 className="text-2xl font-bold p-5">{user?.role} Dashboard</h1>
      <UserNav />
    </div>
  );
};

export default AppTopBar;
