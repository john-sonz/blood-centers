import "./EventForm.css";

import * as yup from "yup";

import { Button, FormLabel, Input, Textarea, VStack } from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import { FormControl, FormErrorMessage } from "@chakra-ui/form-control";

import DatePicker from "react-datepicker";
import { Event } from "../../types/event";
import { Flex } from "@chakra-ui/layout";
import React from "react";
import { yupResolver } from "@hookform/resolvers/yup";

export interface EventFormInputs extends Omit<Event, "id" | "date"> {
  date: Date;
}

interface EventFormProps {
  defaultValues?: Partial<EventFormInputs>;
  onSubmit: (data: EventFormInputs) => void;
  isLoading: boolean;
}

const schema = yup.object().shape({
  description: yup
    .string()
    .required("Opis jest wymagany")
    .max(255, "Opis może mieć do 255 znaków"),
  city: yup
    .string()
    .required("Miasto jest wymagane")
    .max(255, "Miasto może mieć do 255 znaków"),
  address: yup
    .string()
    .required("Adres jest wymagany")
    .max(255, "Adres może mieć do 255 znaków"),
  date: yup.date().required("Data jest wymagana"),
});

export default function EventForm({
  defaultValues,
  onSubmit,
  isLoading,
}: EventFormProps) {
  const {
    control,
    handleSubmit,
    register,
    formState: { errors, touchedFields },
  } = useForm<EventFormInputs>({
    defaultValues,
    resolver: yupResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack>
        <FormControl
          id="desc"
          isRequired
          isInvalid={errors.description && touchedFields.description}
        >
          <FormLabel>Opis wydarzenia</FormLabel>
          <Textarea {...register("description")} rows={5} />
          <FormErrorMessage>{errors?.description?.message}</FormErrorMessage>
        </FormControl>
        <FormControl
          id="city"
          isRequired
          isInvalid={errors.city && touchedFields.city}
        >
          <FormLabel>Miasto</FormLabel>
          <Input {...register("city")} />
          <FormErrorMessage>{errors?.city?.message}</FormErrorMessage>
        </FormControl>
        <FormControl
          id="address"
          isRequired
          isInvalid={errors.address && touchedFields.address}
        >
          <FormLabel>Adres</FormLabel>
          <Input {...register("address")} />
          <FormErrorMessage>{errors?.address?.message}</FormErrorMessage>
        </FormControl>
        <FormControl
          id="date"
          isRequired
          isInvalid={errors.date && touchedFields.date}
        >
          <FormLabel>Data</FormLabel>

          <Controller
            control={control}
            name="date"
            defaultValue={defaultValues?.date ?? new Date()}
            render={({ field }) => (
              <DatePicker
                {...field}
                value={undefined}
                selected={field.value}
                showTimeInput
                timeFormat="HH:mm"
                timeInputLabel="Godzina"
                dateFormat="dd.MM.yyyy HH:mm"
                customInput={<Input w="100%" />}
              />
            )}
          />
          <FormErrorMessage>{errors?.date?.message}</FormErrorMessage>
        </FormControl>

        <Flex justifyContent="flex-end" mt="6">
          <Button type="submit" colorScheme="red" isLoading={isLoading}>
            Zatwierdź
          </Button>
        </Flex>
      </VStack>
    </form>
  );
}
