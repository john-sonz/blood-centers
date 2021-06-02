import React, { ReactNode } from "react";

import { Redirect } from "react-router";
import { routesDict } from "../routes";
import { useAuthContext } from "../contexts/AuthContext";

interface GuestGuardProps {
  children?: ReactNode;
}

export default function GuestGuard({ children }: GuestGuardProps) {
  const { isAuthenticated } = useAuthContext();

  if (isAuthenticated) return <Redirect to={routesDict.main.path}></Redirect>;

  return <>{children}</>;
}
