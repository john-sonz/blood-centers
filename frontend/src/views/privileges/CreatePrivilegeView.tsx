import { Box, Container, Heading, VStack, useToast } from "@chakra-ui/react";
import PrivilegeForm, { PrivilegeFormInputs } from "./PrivilegeForm";
import { useMutation, useQueryClient } from "react-query";

import React from "react";
import axios from "axios";
import { routesDict } from "../../routes";
import { useHistory } from "react-router";

export default function CreatePrivilegeView() {
  const toast = useToast();
  const history = useHistory();
  const queryClient = useQueryClient();

  const { isLoading, mutate: createPrivilege } = useMutation(
    (data: PrivilegeFormInputs) => axios.post(`/privileges`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("privileges");
        queryClient.invalidateQueries("myPrivileges");
        history.push(routesDict.main.privileges.path);
        toast({
          title: "Przywilej zapisano!",
          status: "success",
        });
      },
      onError: () => {
        toast({
          title: "Coś poszło nie tak...",
          description: "Nie udało się utworzyć przywileju",
          status: "error",
        });
      },
    }
  );

  return (
    <Container maxW="container.lg" p={4} boxShadow="xl" rounded="md" bg="white">
      <VStack width="100%">
        <Heading size="lg" pb="4">
          Nowy przywilej
        </Heading>
        <Box width="100%">
          <PrivilegeForm isLoading={isLoading} onSubmit={createPrivilege} />
        </Box>
      </VStack>
    </Container>
  );
}
