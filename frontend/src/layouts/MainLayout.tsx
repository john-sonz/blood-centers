import { Box, Flex } from "@chakra-ui/layout";
import React, { ReactNode, useState } from "react";

import { ChevronRightIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";
import Sidebar from "./Sidebar";
import { useBreakpointValue } from "@chakra-ui/media-query";

const variantsSpec = {
  base: "drawer",
  lg: "sidebar",
} as const;

export default function MainLayout({ children }: { children?: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const variant = useBreakpointValue(variantsSpec);

  return (
    <Flex overflow="hidden" h="100vh" w="100vw">
      <Sidebar
        variant={variant}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <Box flex="1" h="100%" bgColor="gray.200">
        {variant === "drawer" && (
          <Flex
            w="100%"
            h="50px"
            bgColor="white"
            boxShadow="md"
            alignItems="center"
            p="5"
          >
            <IconButton
              icon={<ChevronRightIcon w={8} h={8} />}
              colorScheme="blackAlpha"
              variant="outline"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="open sidebar"
            />
          </Flex>
        )}

        <Box p="6" h="100%" w="100%" overflowY="scroll">
          {children}
        </Box>
      </Box>
    </Flex>
  );
}
