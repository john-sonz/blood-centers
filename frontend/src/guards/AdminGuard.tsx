import React, { ReactNode } from "react";

import { Redirect } from "react-router";
import { routesDict } from "../routes";
import { useAuthContext } from "../contexts/AuthContext";

interface AdminGuardProps {
  children?: ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { user } = useAuthContext();

  if (!user?.isAdmin) return <Redirect to={routesDict.main.path}></Redirect>;

  return <>{children}</>;
}
