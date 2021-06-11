import { Badge, HStack, Heading } from "@chakra-ui/layout";
import { Box, Button, Link, Text, VStack } from "@chakra-ui/react";

import LoadingIndicator from "../../components/LoadingIndicator";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import axios from "axios";
import { routesDict } from "../../routes";
import { useAuthContext } from "../../contexts/AuthContext";
import { useQuery } from "react-query";

interface Privilege {
  min_donated_amount_ml: number;
  description: string;
  id: string;
}

export default function PrivilegesView() {
  const { user } = useAuthContext();
  const { data, isLoading, error } = useQuery("privileges", () =>
    axios.get<{ privileges: Privilege[] }>("/privileges")
  );

  if (isLoading) return <LoadingIndicator />;

  if (error || !data?.data)
    return <Heading size="lg">Nie udało się pobrać przywilejów</Heading>;

  const { privileges } = data.data;
  return (
    <VStack w="100%">
      <Heading size="lg" pb="4">
      Przywileje
      </Heading>
      <VStack w="100%" spacing="5">
        {privileges.length === 0 && (
          <Text fontSize="lg">Brak przywilejów w bazie</Text>
        )}
        {privileges.map((priv) => (
          <Box
            w="60%"
            p={4}
            key={priv.id}
            borderRadius="md"
            boxShadow="lg"
            justifyContent="flex-start"
            alignItems="center"
            bgColor="white"
          >

            <HStack>

              <Text fontSize="sm" color="gray.900">
                {priv.min_donated_amount_ml}
              </Text>

              <Badge colorScheme="blue">
                {priv.min_donated_amount_ml}
              </Badge>

            </HStack>

            <Text my="2" fontSize="xl">
              {priv.description}
            </Text>

          </Box>

        ))}
      </VStack>
    </VStack>
  );
}

