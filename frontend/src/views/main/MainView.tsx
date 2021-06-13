import {
  Badge,
  Box,
  Button,
  Flex,
  Grid,
  HStack,
  Heading,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { Event } from "../../types/event";
import LoadingIndicator from "../../components/LoadingIndicator";
import MyStats from "./MyStats";
import React from "react";
import axios from "axios";

interface EventResponse extends Event {
  totalInterested: number;
  isInterested: boolean;
}

export default function MainView() {
  const toast = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery("myEvents", () =>
    axios.get<{ events: EventResponse[] }>("/me/events")
  );

  const { mutate: addInterest } = useMutation(
    ({ eventId }: { eventId: string }) =>
      axios.post(`/events/${eventId}/interest`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("myEvents");
        queryClient.invalidateQueries("events");
      },
      onError: () => {
        toast({
          title: "Coś poszło nie tak...",
          description: "Nie udało się dodać wydarzenia do śledzonych",
          status: "error",
        });
      },
    }
  );

  const { mutate: removeInterest } = useMutation(
    ({ eventId }: { eventId: string }) =>
      axios.delete(`/events/${eventId}/interest`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("myEvents");
        queryClient.invalidateQueries("events");
      },
      onError: () => {
        toast({
          title: "Coś poszło nie tak...",
          description: "Nie udało się usunąć wydarzenia ze śledzonych",
          status: "error",
        });
      },
    }
  );

  if (isLoading) return <LoadingIndicator />;

  if (error || !data?.data)
    return <Heading size="lg">Coś poszło nie tak...</Heading>;

  const { events } = data.data;

  return (
    <Grid templateColumns="3fr 1fr" gap="3">
      <Box>
        <Heading mb="5">Twoje wydarzenia</Heading>
        <VStack w="100%" spacing="5">
          {events.length === 0 && (
            <Text fontSize="lg">Brak wydarzeń w bazie</Text>
          )}
          {events.map((event) => (
            <Box
              w="100%"
              p={4}
              key={event.id}
              borderRadius="md"
              boxShadow="lg"
              justifyContent="flex-start"
              alignItems="center"
              bgColor="white"
            >
              <HStack>
                <Text fontSize="md" color="gray.900">
                  {event.city}, {event.address}
                </Text>
                <Badge colorScheme="blue">
                  {new Date(event.date).toLocaleDateString()}
                </Badge>
              </HStack>

              <Text my="2" fontSize="xl">
                {event.description}
              </Text>
              <Flex justifyContent="space-between">
                <Text fontSize="lg">
                  Zainteresowane osoby: {event.totalInterested}
                </Text>
                {event.isInterested ? (
                  <Button
                    size="sm"
                    colorScheme="red"
                    onClick={() => removeInterest({ eventId: event.id })}
                  >
                    Przestań śledzić wydarzenie
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    colorScheme="red"
                    onClick={() => addInterest({ eventId: event.id })}
                  >
                    Śledź wydarzenie
                  </Button>
                )}
              </Flex>
            </Box>
          ))}
        </VStack>
      </Box>
      <Box>
        <MyStats />
      </Box>
    </Grid>
  );
}
