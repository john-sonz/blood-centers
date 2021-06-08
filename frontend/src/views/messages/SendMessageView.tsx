import * as yup from "yup";

import { Box, FormControl, FormErrorMessage } from "@chakra-ui/react";
import { Container, Flex, Heading, VStack } from "@chakra-ui/layout";
import { SubmitHandler, useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router";

import { Button } from "@chakra-ui/button";
import React from "react";
import { Textarea } from "@chakra-ui/textarea";
import axios from "axios";
import { routesDict } from "../../routes";
import { useMutation } from "react-query";
import { yupResolver } from "@hookform/resolvers/yup";

type Inputs = { text: string };

const schema = yup.object().shape({
  text: yup
    .string()
    .required("Wiadomość nie może być pusta")
    .max(1024, "Wiadomość może mieć do maksymalnie 1024 znaki"),
});

export default function SendMessageView() {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const {
    handleSubmit,
    register,
    formState: { errors, touchedFields },
    setError,
  } = useForm<Inputs>({
    resolver: yupResolver(schema),
  });

  const { isLoading, mutateAsync: sendMessage } = useMutation(
    (data: { text: string; recipientId: string }) =>
      axios.post("/messages", data)
  );

  const onSubmit: SubmitHandler<Inputs> = async ({ text }) => {
    try {
      await sendMessage({ text, recipientId: id });
      history.push(routesDict.main.messages.path);
    } catch (error) {
      setError("text", { message: "Coś poszło nie tak..." });
    }
  };

  return (
    <Container maxW="container.lg" p={4} boxShadow="xl" rounded="md" bg="white">
      <VStack width="100%">
        <Heading size="lg" pb="4">
          Nowa wiadomość
        </Heading>
        <Box width="100%">
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl
              id="text"
              isRequired
              isInvalid={errors.text && touchedFields.text}
            >
              <Textarea
                {...register("text")}
                placeholder="Wpisz wiadomość"
                rows={5}
              />
              <FormErrorMessage>{errors?.text?.message}</FormErrorMessage>
            </FormControl>

            <Flex justifyContent="flex-end" mt="6">
              <Button type="submit" colorScheme="red" isLoading={isLoading}>
                Wyślij
              </Button>
            </Flex>
          </form>
        </Box>
      </VStack>
    </Container>
  );
}
