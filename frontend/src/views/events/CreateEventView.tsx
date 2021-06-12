import { Box, Container, Heading, VStack, useToast } from "@chakra-ui/react";
import EventForm, { EventFormInputs } from "./EventForm";
import { useMutation, useQueryClient } from "react-query";

import React from "react";
import axios from "axios";
import { routesDict } from "../../routes";
import { useHistory } from "react-router";

export default function CreateEventView() {
  const toast = useToast();
  const history = useHistory();
  const queryClient = useQueryClient();

  const { isLoading, mutate: createEvent } = useMutation(
    (data: EventFormInputs) => axios.post(`/events`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("events");
        history.push(routesDict.main.events.path);
        toast({
          title: "Wydarzenia zapisano!",
          status: "success",
        });
      },
      onError: () => {
        toast({
          title: "Coś poszło nie tak...",
          description: "Nie udało się utworzyć wydarzenia",
          status: "error",
        });
      },
    }
  );

  return (
    <Container maxW="container.lg" p={4} boxShadow="xl" rounded="md" bg="white">
      <VStack width="100%">
        <Heading size="lg" pb="4">
          Nowe wydarzenie
        </Heading>
        <Box width="100%">
          <EventForm isLoading={isLoading} onSubmit={createEvent} />
        </Box>
      </VStack>
    </Container>
  );
}
