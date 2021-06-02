import { Box, Spacer, VStack } from "@chakra-ui/layout";
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
} from "@chakra-ui/react";

import { Button } from "@chakra-ui/button";
import React from "react";
import { useAuthContext } from "../contexts/AuthContext";

function Content() {
  const { logout } = useAuthContext();
  return (
    <Flex direction="column" justifyContent="space-between" h="100%" py="4">
      <VStack>
        <Button w="100%">Some button 1</Button>
        <Button w="100%">Some button 2</Button>
        <Button w="100%">Some button 3</Button>
        <Button w="100%">Some button 4</Button>
        <Spacer></Spacer>
      </VStack>
      <Button
        w="100%"
        bgColor="red.500"
        _hover={{ bgColor: "red.400" }}
        color="white"
        onClick={logout}
      >
        Wyloguj się
      </Button>
    </Flex>
  );
}

interface SidebarProps {
  variant?: "sidebar" | "drawer";
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ variant, isOpen, onClose }: SidebarProps) {
  return variant === "sidebar" ? (
    <Box w="250px" p="4" h="100%" bgColor="blue.900">
      <Content />
    </Box>
  ) : (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
      <DrawerOverlay>
        <DrawerContent bgColor="blue.900">
          <DrawerCloseButton
            bgColor="white"
            _hover={{ bgColor: "whiteAlpha.800" }}
          />
          <DrawerHeader />
          <DrawerBody>
            <Content />
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
}
