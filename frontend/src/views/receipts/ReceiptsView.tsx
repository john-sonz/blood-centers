import { Box, Button, Flex, Link, Text, VStack } from "@chakra-ui/react";
import { HStack, Heading } from "@chakra-ui/layout";

import LoadingIndicator from "../../components/LoadingIndicator";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import axios from "axios";
import { routesDict } from "../../routes";
import { useQuery } from "react-query";

interface Receipt {
  id: string;
  recipientId: string;
  donationId: string;
  date: string;
  amount: number;
  donation: {
    donatorId: string;
  };
}

export default function ReceiptsView() {
  const { data, isLoading, error } = useQuery("myReceipts", () =>
    axios.get<{ receipts: Receipt[] }>("me/receipts")
  );

  if (isLoading) {
    return <LoadingIndicator />;
  }

  console.log(data?.data);

  if (error || !data?.data) {
    return <Heading size="lg">Nie udało się pobrać listy pobrań krwi</Heading>;
  }

  if (data.data === undefined) {
    return <Text fontSize="lg">Nie oddałeś jeszcze krwi</Text>;
  }

  const { receipts } = data.data;

  if (receipts === undefined) {
    return <Text fontSize="lg">Nie oddałeś jeszcze krwi</Text>;
  }

  return (
    <VStack w="100%">
      <Heading size="lg" pb="4">
        Pobrania w bazie
      </Heading>
      <VStack w="100%" spacing="5">
        {receipts.length === 0 && (
          <Text fontSize="lg">Nie pobrałeś jeszcze krwi</Text>
        )}
        {receipts.map((r) => (
          <Box
            w="60%"
            p={4}
            key={r.id}
            borderRadius="md"
            boxShadow="lg"
            justifyContent="flex-start"
            alignItems="center"
            bgColor="white"
          >
            <HStack>
              <Text fontSize="sm" color="gray.900">
                {r.id}
              </Text>
            </HStack>

            <Text my="2" fontSize="xl">
              {"Ilość krwi pobrana " + r.amount}
            </Text>
            <Text fontSize="sm" color="gray.900">
              {"Data oddania krwi: " + new Date(r.date).toLocaleString()}
            </Text>

            <Flex justifyContent="space-between" alignItems="center">
              <div>
                <Text fontSize="sm" color="gray.900" mt={5}>
                  Id donacji: {r.donationId}
                </Text>
                <Text fontSize="sm" color="gray.900">
                  Id biorcy: {r.recipientId}
                </Text>
              </div>
              <Link
                as={RouterLink}
                to={routesDict.main.messages.send(r.donation.donatorId)}
              >
                <Button colorScheme="red" size="sm">
                  Podziękuj dawcy
                </Button>
              </Link>
            </Flex>
          </Box>
        ))}
      </VStack>
    </VStack>
  );
}
