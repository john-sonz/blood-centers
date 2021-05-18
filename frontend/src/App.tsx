import * as React from "react";

import { ChakraProvider, theme } from "@chakra-ui/react";
import { renderRoutes, routes } from "./routes";

import { BrowserRouter } from "react-router-dom";

export function App(): React.ReactElement {
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>{renderRoutes(routes)}</BrowserRouter>
    </ChakraProvider>
  );
}
