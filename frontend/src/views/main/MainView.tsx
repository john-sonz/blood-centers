import { Button } from "@chakra-ui/button";
import React from "react";
import { useAuthContext } from "../../contexts/AuthContext";

export default function MainView() {
  const { logout } = useAuthContext();
  return (
    <Button
      bgColor="red.500"
      _hover={{ bgColor: "red.400" }}
      color="white"
      onClick={logout}
    >
      Wyloguj się
    </Button>
  );
}
