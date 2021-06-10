import { Box, Spacer, VStack } from "@chakra-ui/layout";
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Link,
} from "@chakra-ui/react";

import { Button } from "@chakra-ui/button";
import React, { ReactNode } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { routesDict } from "../routes";
import { Link as RouterLink } from "react-router-dom";

interface SidebarItemProps {
  children?: ReactNode;
  to: string;
}

function SidebarItem({ children, to }: SidebarItemProps) {
  return (
    <Link as={RouterLink} to={to} w="100%">
      <Button colorScheme="red" w="100%">
        {children}
      </Button>
    </Link>
  );
}

function Content() {
  const { logout } = useAuthContext();
  return (
    <Flex direction="column" justifyContent="space-between" h="100%" py="4">
      <VStack spacing="4">
        <SidebarItem to={routesDict.main.path}>Strona główna</SidebarItem>
        <SidebarItem to={routesDict.main.messages.path}>Wiadomości</SidebarItem>
        <SidebarItem to={routesDict.main.events.path}>Wydarzenia</SidebarItem>
        <SidebarItem to={routesDict.main.privilages.path}>Przywileje</SidebarItem>
        <SidebarItem to={routesDict.main.userprivilages.path}>Moje przywileje</SidebarItem>
        <Spacer></Spacer>
      </VStack>
      <Button w="100%" colorScheme="red" onClick={logout}>
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
