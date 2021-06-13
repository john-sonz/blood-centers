import {
  Button,
  IconButton,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { FaPlusCircle } from "react-icons/fa";
import { Heading } from "@chakra-ui/layout";
import { Link } from "react-router-dom";
import LoadingIndicator from "../../components/LoadingIndicator";
import { Privilege } from "../../types/privilege";
import React from "react";
import axios from "axios";
import { routesDict } from "../../routes";

const deletePriv = ({ privilegeId }: { privilegeId: string }) =>
  axios.delete(`/privileges/${privilegeId}`);

export default function PrivilegesView() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { data, isLoading, error } = useQuery("privileges", () =>
    axios.get<{ privileges: Privilege[] }>("/privileges")
  );

  const { mutate: deletePrivilege } = useMutation(deletePriv, {
    retry: false,
    onSuccess: () => {
      queryClient.invalidateQueries("privileges");
      queryClient.invalidateQueries("myPrivileges");
      toast({
        title: "Usunięto przywilej",
        status: "success",
      });
    },
    onError: () => {
      toast({
        title: "Coś poszło nie tak...",
        description: "Nie udało się usunąć przywileju",
        status: "error",
      });
    },
  });

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
                <Th isNumeric>
                  <Link to={routesDict.main.privileges.create}>
                    <Button
                      size="sm"
                      leftIcon={<FaPlusCircle />}
                      colorScheme="red"
                    >
                      Nowy przywilej
                    </Button>
                  </Link>
                </Th>
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
                    <Link to={routesDict.main.privileges.edit(priv.id)}>
                      <IconButton
                        variant="ghost"
                        colorScheme="blue"
                        aria-label="Edit privilega"
                        icon={<EditIcon />}
                      />
                    </Link>
                    <IconButton
                      variant="ghost"
                      colorScheme="red"
                      aria-label="Delete privilega"
                      icon={<DeleteIcon />}
                      onClick={() => deletePrivilege({ privilegeId: priv.id })}
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
