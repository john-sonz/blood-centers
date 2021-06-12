import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Flex,
  IconButton,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";

import { Heading } from "@chakra-ui/layout";
import LoadingIndicator from "../../components/LoadingIndicator";
import { Privilege } from "../../types/privilege";
import React from "react";
import axios from "axios";
import { useQuery } from "react-query";

export default function PrivilegesView() {
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
      <VStack w="80%" spacing="5">
        {privileges.length === 0 && (
          <Text fontSize="lg">Brak przywilejów w bazie</Text>
        )}
        {privileges.length !== 0 && (
          <Table
            colorScheme="gray"
            bgColor="white"
            boxShadow="lg"
            borderRadius="lg"
          >
            <Thead>
              <Tr>
                <Th>Opis</Th>
                <Th isNumeric>Wymagana objętość oddanej krwi</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {privileges.map((priv) => (
                <Tr p={4} key={priv.id}>
                  <Td my="2" fontSize="xl">
                    {priv.description}
                  </Td>
                  <Td isNumeric>{priv.minDonatedAmountMl} ml</Td>
                  <Td isNumeric>
                    <IconButton
                      variant="ghost"
                      colorScheme="blue"
                      aria-label="Edit privilega"
                      icon={<EditIcon />}
                    />
                    <IconButton
                      variant="ghost"
                      colorScheme="red"
                      aria-label="Delete privilega"
                      icon={<DeleteIcon />}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </VStack>
    </VStack>
  );
}
