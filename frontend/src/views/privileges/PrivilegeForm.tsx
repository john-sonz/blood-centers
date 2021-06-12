import * as yup from "yup";

import {
  Button,
  FormLabel,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Textarea,
} from "@chakra-ui/react";
import { FormControl, FormErrorMessage } from "@chakra-ui/form-control";

import { Flex } from "@chakra-ui/layout";
import { Privilege } from "../../types/privilege";
import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

export type PrivilegeFormInputs = Omit<Privilege, "id">;

interface PrivilegeFormProps {
  defaultValues?: Partial<PrivilegeFormInputs>;
  onSubmit: (data: PrivilegeFormInputs) => void;
  isLoading: boolean;
}

const schema = yup.object().shape({
  description: yup
    .string()
    .required("Opis jest wymagany")
    .max(255, "Opis może mieć do 255 znaków"),
  minDonatedAmountMl: yup
    .number()
    .required("To pole jest wymagane")
    .min(1, "Objętość krwi musi być liczbą dodatnią"),
});

export default function PrivilegeForm({
  defaultValues,
  onSubmit,
  isLoading,
}: PrivilegeFormProps) {
  const {
    handleSubmit,
    register,
    formState: { errors, touchedFields },
  } = useForm<PrivilegeFormInputs>({
    defaultValues,
    resolver: yupResolver(schema),
  });

  console.log(defaultValues);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl
        id="text"
        isRequired
        isInvalid={errors.description && touchedFields.description}
      >
        <FormLabel>Opis przywileju</FormLabel>
        <Textarea {...register("description")} rows={5} />
        <FormErrorMessage>{errors?.description?.message}</FormErrorMessage>
      </FormControl>
      <FormControl
        id="text"
        isRequired
        isInvalid={
          errors.minDonatedAmountMl && touchedFields.minDonatedAmountMl
        }
      >
        <FormLabel>Wymagana objętość oddanej krwi</FormLabel>
        <NumberInput min={1} max={1000000} rows={5}>
          <NumberInputField {...register("minDonatedAmountMl")} />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <FormErrorMessage>
          {errors?.minDonatedAmountMl?.message}
        </FormErrorMessage>
      </FormControl>

      <Flex justifyContent="flex-end" mt="6">
        <Button type="submit" colorScheme="red" isLoading={isLoading}>
          Zatwierdź
        </Button>
      </Flex>
    </form>
  );
}
