import { Center } from "@chakra-ui/layout";
import React from "react";
import { Spinner } from "@chakra-ui/react";

export default function SplashScreen() {
  return (
    <Center width="100vw" height="100vh">
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="red.400"
        size="xl"
      />
    </Center>
  );
}
