import { Badge, HStack, Heading } from "@chakra-ui/layout";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Spacer,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { Event } from "../../types/event";
import { FaPlusCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import LoadingIndicator from "../../components/LoadingIndicator";
import React from "react";
import axios from "axios";
import { routesDict } from "../../routes";
import { useAuthContext } from "../../contexts/AuthContext";

interface EventResponse extends Event {
  totalInterested: number;
  isInterested: boolean;
}

export default function EventsView() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { user } = useAuthContext();
  const { data, isLoading, error } = useQuery("events", () =>
    axios.get<{ events: EventResponse[] }>("/events")
  );

  const { mutate: deleteEvent } = useMutation(
    ({ eventId }: { eventId: string }) => axios.delete(`/events/${eventId}`),
    {
      retry: false,
      onSuccess: () => {
        queryClient.invalidateQueries("events");
        queryClient.invalidateQueries("myEvents");
        toast({
          title: "Usunięto wydarzenie",
          status: "success",
        });
      },
      onError: () => {
        toast({
          title: "Coś poszło nie tak...",
          description: "Nie udało się usunąć wydarzenia",
          status: "error",
        });
      },
    }
  );

  const { mutate: addInterest } = useMutation(
    ({ eventId }: { eventId: string }) =>
      axios.post(`/events/${eventId}/interest`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("events");
        queryClient.invalidateQueries("myEvents");
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
        queryClient.invalidateQueries("events");
        queryClient.invalidateQueries("myEvents");
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
    return <Heading size="lg">Nie udało się pobrać wydarzeń</Heading>;

  const { events } = data.data;
  return (
    <VStack w="100%">
      <Heading size="lg" pb="4">
        Wydarzenia
      </Heading>
      <VStack w="60%" spacing="5">
        {user?.isAdmin && (
          <Flex justifyContent="flex-end" w="100%">
            <Link to={routesDict.main.events.create}>
              <Button size="sm" leftIcon={<FaPlusCircle />} colorScheme="red">
                Nowe wydarzenie
              </Button>
            </Link>
          </Flex>
        )}
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
              <Spacer />
              {user?.isAdmin && (
                <div>
                  <Link to={routesDict.main.events.edit(event.id)}>
                    <IconButton
                      variant="ghost"
                      colorScheme="blue"
                      aria-label="Edit event"
                      icon={<EditIcon />}
                    />
                  </Link>
                  <IconButton
                    variant="ghost"
                    colorScheme="red"
                    aria-label="Delete event"
                    icon={<DeleteIcon />}
                    onClick={() => deleteEvent({ eventId: event.id })}
                  />
                </div>
              )}
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
    </VStack>
  );
}
