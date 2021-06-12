import { HStack, Heading } from "@chakra-ui/layout";
import { Box, Button, Text, VStack } from "@chakra-ui/react";

import LoadingIndicator from "../../components/LoadingIndicator";
import React from "react";
import axios from "axios";
import { useQuery } from "react-query";

interface Receipt {
    id: string,
    recipientId: string,
    donationId: string,
    date: string,
    amount: number
}

export default function AdminReceiptsView() {
    const { data, isLoading, error } = useQuery("adminReceipts", () =>
    axios.get<{ receipts: Receipt[] }>("/receipts/")  
  );


    if(isLoading) {
        return <LoadingIndicator />
    }

    console.log(data?.data);

    if (error || !data?.data) {
        return <Heading size="lg">Nie udało się pobrać listy pobiorów krwi</Heading>;
    }

    if(data.data === undefined) {
      return  <Text fontSize="lg">Nie oddałeś jeszcze krwi</Text>;
    }

    const deleteReceipt = async (id:string ) => {
      try {
        await axios.delete(`/receipts/${id}`);
        window.location.reload(false);
      } catch(error){
        console.log(error);
      }
      return null;
    }
    
    return (
        <VStack w="100%">
          <Heading size="lg" pb="4">
            Pobrania w bazie
          </Heading>
          <VStack w="100%" spacing="5">
            {data.data.length === 0 && (
              <Text fontSize="lg">Nie oddałeś jeszcze krwi</Text>
            )}
            {data.data.map((r) => (
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
                    <Button colorScheme="red" size="sm" onClick={() => deleteReceipt(r.id)}>
                      Usuń to pobranie
                    </Button>
              </HStack>


          <Text my="2" fontSize="xl">
            { "Ilość krwi pobrana " + r.amount }

          </Text>
          <Text fontSize="sm" color="gray.900">
              {"Data oddania krwi: " + new Date(r.date).toLocaleString()}
            </Text>

            <Text fontSize="sm" color="gray.900" mt={5}>
                  { "Id donacji: " + r.donationId }
                </Text> 
                <Text fontSize="sm" color="gray.900">
                  { "Id dawcy: " + r.recipientId }
                </Text> 
            </Box>
            ))}
          </VStack>
        </VStack>
      );

}
