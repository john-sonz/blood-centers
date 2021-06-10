import { Badge, HStack, Heading } from "@chakra-ui/layout";
import { Box, Button, Link, Text, VStack } from "@chakra-ui/react";

import LoadingIndicator from "../../components/LoadingIndicator";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import axios from "axios";
import { routesDict } from "../../routes";
import { useAuthContext } from "../../contexts/AuthContext";
import { useQuery } from "react-query";

interface Message {
  text: string;
  sentAt: string;
  recipientId: string;
  senderId: string;
  id: string;
}

export default function MessagesView() {
  const { user } = useAuthContext();
  const { data, isLoading, error } = useQuery("myMessages", () =>
    axios.get<{ messages: Message[] }>("/me/messages")
  );

  if (isLoading) return <LoadingIndicator />;

  if (error || !data?.data)
    return <Heading size="lg">Nie udało się pobrać wiadomości</Heading>;

  const { messages } = data.data;
  return (
    <VStack w="100%">
      <Heading size="lg" pb="4">
        Twoje wiadomości
      </Heading>
      <VStack w="100%" spacing="5">
        {messages.length === 0 && (
          <Text fontSize="lg">Nie masz żadnych wiadomości</Text>
        )}
        {messages.map((msg) => (
          <Box
            w="60%"
            p={4}
            key={msg.id}
            borderRadius="md"
            boxShadow="lg"
            justifyContent="flex-start"
            alignItems="center"
            bgColor="white"
          >
            <HStack>
              <Text fontSize="sm" color="gray.900">
                {new Date(msg.sentAt).toLocaleString()}
              </Text>
              <Badge colorScheme={msg.senderId === user?.id ? "blue" : "green"}>
                {msg.senderId === user?.id ? "Wysłane" : "Odebrane"}
              </Badge>
            </HStack>
            <Text my="2" fontSize="xl">
              {msg.text}
            </Text>
            {msg.senderId !== user?.id && (
              <Link
                as={RouterLink}
                to={routesDict.main.messages.send(msg.senderId)}
              >
                <Button colorScheme="red" size="sm">
                  Odpowiedz
                </Button>
              </Link>
            )}
          </Box>
        ))}
      </VStack>
    </VStack>
  );
}
