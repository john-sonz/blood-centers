import React from "react";
import { useAuthContext } from "../../contexts/AuthContext";

export default function MainView() {
  const { user } = useAuthContext();
  return (
    <h2>
      Hello {user?.firstName} {user?.lastName}
    </h2>
  );
}
