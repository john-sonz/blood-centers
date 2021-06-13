import { Box, Flex, Progress, Text, VStack } from "@chakra-ui/react";

import { CheckCircleIcon } from "@chakra-ui/icons";
import { Heading } from "@chakra-ui/layout";
import LoadingIndicator from "../../components/LoadingIndicator";
import { Privilege } from "../../types/privilege";
import React from "react";
import axios from "axios";
import { useQuery } from "react-query";

export default function MyPrivilegesView() {
  const { data, isLoading, error } = useQuery("myPrivileges", () =>
    axios.get<{ donatedMl: number; privileges: Privilege[] }>(
      "/me/privileges",
      { params: { allPrivileges: true } }
    )
  );

  if (isLoading) return <LoadingIndicator />;

  if (error || !data?.data)
    return <Heading size="lg">Nie udało się pobrać Twoich przywilejów</Heading>;

  const { privileges, donatedMl } = data.data;
  return (
    <VStack w="100%">
      <Heading size="lg" pb="4">
        Twoje przywileje
      </Heading>

      <VStack w="100%" spacing="5">
        <Text fontSize="xl">
          Całkowita objętość oddanej krwi - {donatedMl} ml{" "}
        </Text>
        {privileges.length === 0 && (
          <Text fontSize="lg">Nie masz żadnych przywilejów</Text>
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
            <Flex my="2" justifyContent="space-between" alignItems="center">
              <Text fontSize="xl">{priv.description}</Text>
              <Flex alignItems="center">
                <Text>
                  {donatedMl}/{priv.minDonatedAmountMl} ml
                </Text>
                {donatedMl >= priv.minDonatedAmountMl && (
                  <CheckCircleIcon mx="1" color="red.500" />
                )}
              </Flex>
            </Flex>
            <Progress
              borderRadius="md"
              colorScheme="red"
              size="sm"
              value={Math.min(priv.minDonatedAmountMl, donatedMl)}
              max={priv.minDonatedAmountMl}
            />
          </Box>
        ))}
      </VStack>
    </VStack>
  );
}
