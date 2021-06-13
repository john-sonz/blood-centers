import * as yup from "yup";

import { Box, Center, Container, Link, VStack } from "@chakra-ui/layout";
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
import { routesDict } from "../../routes";
import { useAuthContext } from "../../contexts/AuthContext";
import { yupResolver } from "@hookform/resolvers/yup";

interface LoginForm {
  pesel: string;
  password: string;
}

const schema = yup.object().shape({
  pesel: yup.string().required("Pesel jest wymagany"),
  password: yup.string().required("Hasło jest wymagane"),
});

export default function Login() {
  const { login } = useAuthContext();
  const {
    handleSubmit,
    register,
    setError,
    formState: { errors, touchedFields, isSubmitting },
  } = useForm<LoginForm & { submitError: string }>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<LoginForm> = async ({ password, pesel }) => {
    try {
      await login(pesel, password);
    } catch (_) {
      setError("submitError", { message: "Błędny PESEL lub hasło" });
    }
  };

  return (
    <Center width="100vw" height="100vh" bgColor="gray.300">
      <Container p={6} spacing={4} boxShadow="xl" rounded="md" bg="white">
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack spacing={4} align="flex-start">
            <FormControl
              id="pesel"
              isRequired
              isInvalid={errors.pesel && touchedFields.pesel}
            >
              <FormLabel>PESEL</FormLabel>
              <Input type="text" {...register("pesel")} autoComplete="off" />
              <FormErrorMessage>{errors.pesel?.message}</FormErrorMessage>
            </FormControl>
            <FormControl
              id="password"
              isRequired
              isInvalid={errors.password && touchedFields.password}
            >
              <FormLabel>Hasło</FormLabel>
              <Input type="password" {...register("password")} />
              <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.submitError}>
              <FormErrorMessage>{errors.submitError?.message}</FormErrorMessage>
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
              Zaloguj się
            </Button>
          </VStack>
        </form>
        <Box mt="2">
          <Link as={RouterLink} to={routesDict.register} color="blue.500">
            Nie masz konta? Zarejestruj się
          </Link>
        </Box>
      </Container>
    </Center>
  );
}
