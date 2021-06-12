import { Box, Container, Heading, VStack, useToast } from "@chakra-ui/react";
import EventForm, { EventFormInputs } from "./EventForm";
import { useHistory, useParams } from "react-router";
import { useMutation, useQuery } from "react-query";

import { Event } from "../../types/event";
import LoadingIndicator from "../../components/LoadingIndicator";
import React from "react";
import axios from "axios";
import { routesDict } from "../../routes";

export default function EditEventView() {
  const toast = useToast();
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useQuery(["getEvent", id], () =>
    axios.get<Event>(`/events/${id}`)
  );

  const { isLoading: isMutating, mutate: editEvent } = useMutation(
    (data: EventFormInputs) => axios.put(`/events/${id}`, data),
    {
      onSuccess: () => {
        history.push(routesDict.main.events.path);
        toast({
          title: "Wydarzenie zapisano!",
          status: "success",
        });
      },
      onError: () => {
        toast({
          title: "Coś poszło nie tak...",
          description: "Nie udało się edytować wydarzenia",
          status: "error",
        });
      },
    }
  );

  if (isLoading) return <LoadingIndicator />;

  if (error || !data?.data)
    return <Heading size="lg">Nie udało się pobrać wydarzenia</Heading>;

  return (
    <Container maxW="container.lg" p={4} boxShadow="xl" rounded="md" bg="white">
      <VStack width="100%">
        <Heading size="lg" pb="4">
          Edycja wydarzenie
        </Heading>
        <Box width="100%">
          <EventForm
            defaultValues={{
              ...data.data,
              date: new Date(data.data.date),
            }}
            isLoading={isMutating}
            onSubmit={editEvent}
          />
        </Box>
      </VStack>
    </Container>
  );
}
