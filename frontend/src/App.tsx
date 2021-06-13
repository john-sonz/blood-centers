import "react-datepicker/dist/react-datepicker.css";

import * as React from "react";

import { ChakraProvider, theme } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import { renderRoutes, routes } from "./routes";

import AuthContextProvider from "./contexts/AuthContext";
import { BrowserRouter } from "react-router-dom";
import pl from "date-fns/locale/pl";

registerLocale("pl", pl);
setDefaultLocale("pl");

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
