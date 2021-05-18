import * as React from "react";

import { ChakraProvider, theme } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { renderRoutes, routes } from "./routes";

import AuthContextProvider from "./contexts/AuthContext";
import { BrowserRouter } from "react-router-dom";

const queryClient = new QueryClient();

export function App(): React.ReactElement {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <AuthContextProvider>
          <BrowserRouter>{renderRoutes(routes)}</BrowserRouter>
        </AuthContextProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
}
