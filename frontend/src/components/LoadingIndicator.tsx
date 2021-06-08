import { Center, Spinner } from "@chakra-ui/react";
import React from "react";

export default function LoadingIndicator() {
  return (
    <Center w="100%" h="100%">
      <Spinner
        thickness="6px"
        speed="0.65s"
        emptyColor="gray.200"
        color="red.600"
        size="xl"
      />
    </Center>
  );
}
