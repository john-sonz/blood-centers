import { Badge, HStack, Heading } from "@chakra-ui/layout";
import { Box, Button, Link, Text, VStack } from "@chakra-ui/react";

import LoadingIndicator from "../../components/LoadingIndicator";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import axios from "axios";
import { routesDict } from "../../routes";
import { useQuery } from "react-query";

interface Donation {
    id: string,
    date: string,
    amountMl: number,
    availableMl: number,
}

export default function AdminDonationsView() {
    const { data, isLoading, error } = useQuery("adminDonations", () =>
    axios.get<{ donations: Donation[] }>("/donations")
  );

    if(isLoading) {
        return <LoadingIndicator />
    }

    if (error || !data?.data)
    return <Heading size="lg">Nie udało się pobrać donacji</Heading>;

    const { donations } = data.data;

    const deleteDonation = async (id:string ) => {
      try {
        await axios.delete(`/donations/${id}`);
        window.location.reload(false);
      } catch(error){
        console.log(error);
      }
      return null;
    }

    return (
        <VStack w="100%">
          <Heading size="lg" pb="4">
            Donacje w bazie
          </Heading>
          <VStack w="100%" spacing="5">
            {donations.length === 0 && (
              <Text fontSize="lg">Nie oddałeś jeszcze krwi</Text>
            )}
            {donations.map((d) => (
              <Box
                w="60%"
                p={4}
                key={d.id}
                borderRadius="md"
                boxShadow="lg"
                justifyContent="flex-start"
                alignItems="center"
                bgColor="white"
              >
                <HStack>
                  <Text fontSize="sm" color="gray.900">
                    {d.id}
                  </Text>
                   { renderElement(d.availableMl, d.date) } 
 
                  <Button colorScheme="red" size="sm" onClick={() => deleteDonation(d.id)}>
                      Usuń donację
                    </Button>
                </HStack>

                <Text my="2" fontSize="xl">
              { "Dostępna ilość krwi " + d.availableMl }

            </Text>
            <Text my="2" fontSize="xl">
              { "Ilość krwi oddana " + d.amountMl }

            </Text>
            <Text fontSize="sm" color="gray.900">
                {"Data oddania krwi: " + new Date(d.date).toLocaleString()}
              </Text>
              { renderButtonElement(d.availableMl, d.date, d.id) }
              </Box>
            ))}
          </VStack>
        </VStack>
      );
}

function renderElement(availableMl: number, donationDate: string | number | Date){
    if(availableMl > 0 && new Date(donationDate) > new Date("2020-06-01 00:00:00")){
      return ( <><Badge colorScheme={"green"}>
          {"Dostępne"}
      </Badge><Badge colorScheme={"green"}>
              {"Świeża krew"}
          </Badge></>
      );
    } else {
        return ( <><Badge colorScheme={"red"}>
        {"Niedostępne"}
    </Badge><Badge colorScheme={"red"}>
            {"Przedawniona krew"}
        </Badge></>
    );
    }
}

function renderButtonElement(availableMl: number, donationDate: string | number | Date, id: string) {
    if(availableMl > 0 && new Date(donationDate) > new Date("2020-06-01 00:00:00")){
        return ( <Link
            as={RouterLink}
            to={routesDict.main.receipts.addFromDonation(id)}
          >
            <Button colorScheme="red" size="sm">
              Pobierz krew z tej donacji
            </Button>
          </Link>
        );
      } else {
            return null;
      }
}