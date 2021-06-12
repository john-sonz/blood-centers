import * as yup from "yup";

import { Box, Container, Link, VStack } from "@chakra-ui/layout";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";

import React from "react";
import { Link as RouterLink } from "react-router-dom";
import axios from "axios";
import { routesDict } from "../../routes";
import { yupResolver } from "@hookform/resolvers/yup";

interface DonationForm {
    donatorId: string;
    amountMl: number;
    availableMl: number;
}

const schema = yup.object().shape({
    donatorId: yup
    .string()
    .required("Id dawcy jest wymagane")
    .length(36, "Podane id jest błędne"),
    amountMl: yup
    .number()
    .required("Ilość oddanej krwi jest wymagana"),
    availableMl: yup
    .number()
    .required("Ilość oddanej krwi jest wymagana"),
});


export default function AddDonation() {
    const {
      handleSubmit,
      register,
      setError,
      formState: { errors, isSubmitting },
    } = useForm<DonationForm & { submitError: string }>({
      resolver: yupResolver(schema),
    });

    
  const onSubmit: SubmitHandler<DonationForm> = async (data) => {
    try {
      await axios.post("/donations/", data);
    } catch (error: unknown) {
      if (
        axios.isAxiosError(error)
      )
      setError("submitError", { message: "Coś poszło nie tak" });
    }
  };

    return (
          <Container p={6} spacing={4} boxShadow="xl" rounded="md" bg="white">
            <form onSubmit={handleSubmit(onSubmit, (a) => console.log(a))}>
              <VStack spacing={4} align="flex-start">
                <FormControl
                  id="donatorId"
                  isRequired
                >
                  <FormLabel>Id dawcy</FormLabel>
                  <Input type="text" {...register("donatorId")} autoComplete="off" />
                  <FormErrorMessage>{errors.donatorId?.message}</FormErrorMessage>
                </FormControl>
    
                <FormControl
                  id="amountMl"
                  isRequired
                >
                  <FormLabel>Ilość oddanej krwi</FormLabel>
                  <Input type="text" {...register("amountMl")} />
                </FormControl>
    
                <FormControl
                  id="availableMl"
                  isRequired
                >
                  <FormLabel>Ilość dostępnej krwi</FormLabel>
                  <Input type="text" {...register("availableMl")} />
                </FormControl>
    
                <Button
                  isLoading={isSubmitting}
                  bgColor="blue.500"
                  color="white"
                  width="100%"
                  _hover={{
                    bgColor: "blue.300",
                  }}
                  type="submit"
                >
                  Dodaj donację
                </Button>
              </VStack>
            </form>
            <Box mt="2">
              <Link as={RouterLink} to={routesDict.main.adminDonations.path} color="blue.500">
                Zobacz inne donacje krwi
              </Link>
            </Box>
          </Container>
      );
  
}
