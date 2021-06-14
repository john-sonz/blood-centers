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

interface ReceiptForm {
  recipientId: string;
  donationId: string;
  amount: number;
}

const schema = yup.object().shape({
  recipientId: yup
    .string()
    .required("Id biorcy jest wymagane")
    .length(36, "Podane id jest błędne"),
  donationId: yup
    .string()
    .required("Id donacji jest wymagane")
    .length(36, "Podane id jest błędne"),
  amount: yup
    .number()
    .required("Ilość oddanej krwi jest wymagana")
    .min(1, "Objętość krwi musi być liczbą dodatnią"),
});

export default function AddReceipt() {
  const {
    handleSubmit,
    register,
    setError,
    formState: { errors, isSubmitting, touchedFields },
  } = useForm<ReceiptForm & { submitError: string }>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<ReceiptForm> = async (data) => {
    try {
      await axios.post("/receipts/", data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError("submitError", { message: "Niepoprawne dane wejściowe" });
      }
    }
  };

  return (
    <Container p={6} spacing={4} boxShadow="xl" rounded="md" bg="white">
      <form onSubmit={handleSubmit(onSubmit, (a) => console.log(a))}>
        <VStack spacing={4} align="flex-start">
          <FormControl
            id="recipientId"
            isRequired
            isInvalid={errors.recipientId && touchedFields.recipientId}
          >
            <FormLabel>Id biorcy</FormLabel>
            <Input
              type="text"
              {...register("recipientId")}
              autoComplete="off"
            />
            <FormErrorMessage>{errors.recipientId?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.submitError}>
            <FormErrorMessage>{errors.submitError?.message}</FormErrorMessage>
          </FormControl>

          <FormControl
            id="donationId"
            isRequired
            isInvalid={errors.donationId && touchedFields.donationId}
          >
            <FormLabel>Id donacji</FormLabel>
            <Input type="text" {...register("donationId")} autoComplete="off" />
            <FormErrorMessage>{errors.donationId?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.submitError}>
            <FormErrorMessage>{errors.submitError?.message}</FormErrorMessage>
          </FormControl>

          <FormControl id="amount" isRequired isInvalid={!!errors.amount}>
            <FormLabel>Ilość oddanej krwi</FormLabel>
            <Input type="number" {...register("amount")} />
          </FormControl>
          <FormErrorMessage>{errors.amount?.message}</FormErrorMessage>

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
            Dodaj pobranie krwi
          </Button>
        </VStack>
      </form>
      <Box mt="2">
        <Link
          as={RouterLink}
          to={routesDict.main.adminReceipts.path}
          color="blue.500"
        >
          Zobacz inne pobrania krwi
        </Link>
      </Box>
    </Container>
  );
}
