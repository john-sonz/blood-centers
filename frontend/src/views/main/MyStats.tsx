import {
  Box,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  VStack,
} from "@chakra-ui/react";

import LoadingIndicator from "../../components/LoadingIndicator";
import React from "react";
import axios from "axios";
import { useQuery } from "react-query";

interface IMyStats {
  donatedMl: number;
  receivedMl: number;
  donations: number;
  helpedPeople: number;
  helpedMe: number;
}

export default function MyStats() {
  const { data, isLoading, error } = useQuery("myStats", () =>
    axios.get<{ stats: IMyStats }>("/me/stats")
  );

  if (isLoading) return <LoadingIndicator />;

  if (error || !data?.data)
    return <Heading>Nie udało się pobrać statystyk </Heading>;

  const { stats } = data.data;

  return (
    <>
      <Heading mb="5">Twoje statystyki</Heading>
      <VStack spacing={5}>
        <Box borderRadius="lg" boxShadow="lg" bgColor="white" p={4} width="90%">
          <Stat>
            <StatLabel fontSize="lg">Donacje</StatLabel>
            <StatNumber color="red">{stats.donations}</StatNumber>
          </Stat>
        </Box>
        <Box borderRadius="lg" boxShadow="lg" bgColor="white" p={4} width="90%">
          <Stat>
            <StatLabel fontSize="lg">Odddana krew</StatLabel>
            <StatNumber color="red">{stats.donatedMl} ml</StatNumber>
          </Stat>
        </Box>
        <Box borderRadius="lg" boxShadow="lg" bgColor="white" p={4} width="90%">
          <Stat>
            <StatLabel fontSize="lg">
              Osoby które skorzystały z twojej krwi
            </StatLabel>
            <StatNumber color="red">{stats.helpedPeople}</StatNumber>
          </Stat>
        </Box>
        <Box borderRadius="lg" boxShadow="lg" bgColor="white" p={4} width="90%">
          <Stat>
            <StatLabel fontSize="lg">Otrzymana krew</StatLabel>
            <StatNumber color="red">{stats.receivedMl} ml</StatNumber>
          </Stat>
        </Box>
        <Box borderRadius="lg" boxShadow="lg" bgColor="white" p={4} width="90%">
          <Stat>
            <StatLabel fontSize="lg">Osoby których krew Ci pomogła</StatLabel>
            <StatNumber color="red">{stats.helpedMe}</StatNumber>
          </Stat>
        </Box>
      </VStack>
    </>
  );
}
