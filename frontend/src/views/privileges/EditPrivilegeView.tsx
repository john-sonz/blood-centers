import { Box, Container, Heading, VStack, useToast } from "@chakra-ui/react";
import PrivilegeForm, { PrivilegeFormInputs } from "./PrivilegeForm";
import { useHistory, useParams } from "react-router";
import { useMutation, useQuery } from "react-query";

import LoadingIndicator from "../../components/LoadingIndicator";
import { Privilege } from "../../types/privilege";
import React from "react";
import axios from "axios";
import { routesDict } from "../../routes";

export default function EditPrivilegeView() {
  const toast = useToast();
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useQuery(["getPrivilega", id], () =>
    axios.get<Privilege>(`/privileges/${id}`)
  );

  const { isLoading: isMutating, mutate: editPrivilege } = useMutation(
    (data: PrivilegeFormInputs) => axios.put(`/privileges/${id}`, data),
    {
      onSuccess: () => {
        history.push(routesDict.main.privileges.path);
        toast({
          title: "Przywilej zapisano!",
          status: "success",
        });
      },
      onError: () => {
        toast({
          title: "Coś poszło nie tak...",
          description: "Nie udało się edytować przywileju",
          status: "error",
        });
      },
    }
  );

  if (isLoading) return <LoadingIndicator />;

  if (error || !data?.data)
    return <Heading size="lg">Nie udało się pobrać przywileju</Heading>;

  return (
    <Container maxW="container.lg" p={4} boxShadow="xl" rounded="md" bg="white">
      <VStack width="100%">
        <Heading size="lg" pb="4">
          Edycja przywileju
        </Heading>
        <Box width="100%">
          <PrivilegeForm
            defaultValues={data.data}
            isLoading={isMutating}
            onSubmit={editPrivilege}
          />
        </Box>
      </VStack>
    </Container>
  );
}
