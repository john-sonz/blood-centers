import React, { ReactNode } from "react";

import { Redirect } from "react-router";
import { routesDict } from "../routes";
import { useAuthContext } from "../contexts/AuthContext";

interface AuthGuardProps {
  children?: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated } = useAuthContext();

  if (!isAuthenticated) return <Redirect to={routesDict.login}></Redirect>;

  return <>{children}</>;
}
