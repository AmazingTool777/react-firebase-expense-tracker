import { useState, FormEvent } from "react";
import {
  Box,
  Button,
  Card,
  Flex,
  Grid,
  Heading,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Radio,
  RadioGroup,
  Stack,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

export type AddRecordFormSubmitPayload = {
  label: string;
  amount: number;
  isAddition: boolean;
};

export type AddRecordFormProps = {
  isSubmitting?: boolean;
  onSubmit?(payload: AddRecordFormSubmitPayload): void;
};

export default function AddRecordForm({
  isSubmitting,
  onSubmit,
}: AddRecordFormProps) {
  const [amount, setAmount] = useState(0);
  const [label, setLabel] = useState("");
  const [isAddition, setIsAddition] = useState(true);

  const canSubmit = amount > 0 && !!label;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({
        amount,
        label,
        isAddition,
      });
      // Reset
      setAmount(0);
      setIsAddition(true);
      setLabel("");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card py="1rem" px="1rem">
        <Heading as="h2" size="lg" mb="1rem">
          Create a new record
        </Heading>
        <Stack spacing="0.5rem">
          <Input
            value={label}
            disabled={isSubmitting}
            placeholder="Label"
            onChange={(e) => setLabel(e.target.value)}
          />
          <Flex alignItems="center" columnGap="1rem">
            <Flex
              alignItems="center"
              columnGap="0.25rem"
              flexGrow="1"
              shrink="1"
              flexBasis="auto"
            >
              <span>$</span>
              <NumberInput
                value={amount}
                min={0}
                onChange={(_, value) => setAmount(value || 0)}
              >
                <NumberInputField disabled={isSubmitting} />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </Flex>
            <RadioGroup
              value={isAddition ? "in" : "out"}
              onChange={(value) => setIsAddition(value === "in")}
            >
              <Flex columnGap="0.5rem">
                <Radio colorScheme="green" value="in" disabled={isSubmitting}>
                  <Box color="green">Income</Box>
                </Radio>
                <Radio colorScheme="red" value="out" disabled={isSubmitting}>
                  <Box color="red">Expense</Box>
                </Radio>
              </Flex>
            </RadioGroup>
          </Flex>
          <Grid>
            <Button
              type="submit"
              isDisabled={!canSubmit}
              isLoading={isSubmitting}
              loadingText="Creating ..."
              leftIcon={<AddIcon />}
              colorScheme="teal"
            >
              Create
            </Button>
          </Grid>
        </Stack>
      </Card>
    </form>
  );
}
