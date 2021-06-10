import * as yup from "yup";

import { Box, Center, Container, Link, VStack } from "@chakra-ui/layout";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
} from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";

import React from "react";
import { Link as RouterLink } from "react-router-dom";
import SplashScreen from "../../components/SplashScreen";
import axios from "axios";
import humanReadableBloodType from "../../utils/humanReadableBloodType";
import { routesDict } from "../../routes";
import { useAuthContext } from "../../contexts/AuthContext";
import { useQuery } from "react-query";
import { yupResolver } from "@hookform/resolvers/yup";

interface RegisterForm {
  pesel: string;
  firstName: string;
  lastName: string;
  password: string;
  bloodType: string;
}

const schema = yup.object().shape({
  pesel: yup
    .string()
    .required("Pesel jest wymagany")
    .length(11, "Błędny pesel"),
  firstName: yup.string().required("Imię jest wymagane"),
  lastName: yup.string().required("Nazwisko jest wymagane"),
  password: yup
    .string()
    .required("Hasło jest wymagane")
    .min(6, "Hasło musi mieć przynajmniej 6 znaków"),
  bloodType: yup.string().required("Typ krwi jest wymagany"),
});

export default function Login() {
  const { reinitialize } = useAuthContext();
  const {
    handleSubmit,
    register,
    setError,
    formState: { errors, touchedFields, isSubmitting },
  } = useForm<RegisterForm & { submitError: string }>({
    resolver: yupResolver(schema),
  });

  const { data, isLoading, error } = useQuery("bloodTypes", () =>
    axios.get("/blood-types")
  );

  const onSubmit: SubmitHandler<RegisterForm> = async (data) => {
    try {
      await axios.post("/auth/register", data);
      reinitialize();
    } catch (error: unknown) {
      if (
        axios.isAxiosError(error) &&
        error.response?.data?.error === "user already exists"
      )
        setError("pesel", { message: "Użytkownik z tym pesel już istnieje" });
      else setError("submitError", { message: "Coś poszło nie tak" });
    }
  };

  if (isLoading) return <SplashScreen />;
  if (!data || error) return <SplashScreen />;

  const bloodTypes = data.data.bloodTypes as string[];

  return (
    <Center width="100vw" height="100vh" bgColor="gray.300">
      <Container p={6} spacing={4} boxShadow="xl" rounded="md" bg="white">
        <form onSubmit={handleSubmit(onSubmit, (a) => console.log(a))}>
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
              id="firstName"
              isRequired
              isInvalid={errors.firstName && touchedFields.firstName}
            >
              <FormLabel>Imię</FormLabel>
              <Input type="text" {...register("firstName")} />
              <FormErrorMessage>{errors.firstName?.message}</FormErrorMessage>
            </FormControl>

            <FormControl
              id="lastName"
              isRequired
              isInvalid={errors.lastName && touchedFields.lastName}
            >
              <FormLabel>Nazwisko</FormLabel>
              <Input type="text" {...register("lastName")} autoComplete="off" />
              <FormErrorMessage>{errors.lastName?.message}</FormErrorMessage>
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

            <FormControl
              id="bloodType"
              isRequired
              isInvalid={errors.bloodType && touchedFields.bloodType}
            >
              <FormLabel>Typ krwi</FormLabel>
              <Select {...register("bloodType")} placeholder="Wybierz typ krwi">
                {bloodTypes.map((type) => (
                  <option key={type} value={type}>
                    {humanReadableBloodType(type)}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{errors.bloodType?.message}</FormErrorMessage>
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
              Zarejestruj się
            </Button>
          </VStack>
        </form>
        <Box mt="2">
          <Link as={RouterLink} to={routesDict.login} color="blue.500">
            Masz już konto? Zaloguj się
          </Link>
        </Box>
      </Container>
    </Center>
  );
}
