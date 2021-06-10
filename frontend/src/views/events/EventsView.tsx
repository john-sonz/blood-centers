import { Badge, HStack, Heading } from "@chakra-ui/layout";
import { Box, Button, Link, Text, VStack } from "@chakra-ui/react";

import LoadingIndicator from "../../components/LoadingIndicator";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import axios from "axios";
import { routesDict } from "../../routes";
import { useAuthContext } from "../../contexts/AuthContext";
import { useQuery } from "react-query";

interface Event {
  description: string;
  id: string;
  city: string;
  adress: string;
  date: string;
}

export default function EventsView() {
  const { data, isLoading, error } = useQuery("events", () =>
    axios.get<{ events: Event[] }>("/me/events")
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
      <VStack w="100%" spacing="5">
        {events.length === 0 && (
          <Text fontSize="lg">Brak zaplanowanych wydarzeń</Text>
        )}
        {events.map((event) => (
          <Box
            w="60%"
            p={4}
            key={event.id}
            borderRadius="md"
            boxShadow="lg"
            justifyContent="flex-start"
            alignItems="center"
            bgColor="white"
          >

            <HStack>

              <Text fontSize="sm" color="gray.900">
                {event.city}
              </Text>
              <Text fontSize="sm" color="gray.900">
                {event.adress}
              </Text>
              <Badge colorScheme="blue">
                {event.date}
              </Badge>

            </HStack>

            <Text my="2" fontSize="xl">
              {event.description}
            </Text>

          </Box>

        ))}
      </VStack>
    </VStack>
  );
}

