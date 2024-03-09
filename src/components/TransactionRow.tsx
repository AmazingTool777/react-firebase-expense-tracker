import { PropsWithChildren } from "react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Flex, IconButton, Td, Text, Tr } from "@chakra-ui/react";

import EditTransactionModal from "./EditTransactionModal";
import { Transaction } from "../types";
import DeleteTransactionModal from "./DeleteTransactionModal";
import useColors from "../hooks/useColors";
import { toReadableDate } from "../utils/date-time.utils";

export type TransactionRowProps = PropsWithChildren<{
  transaction: Transaction;
}>;

export default function TransactionRow({
  children,
  transaction,
}: TransactionRowProps) {
  const { getAmountColor } = useColors();

  return (
    <Tr key={transaction.id}>
      <Td>
        <Flex columnGap="0.5rem">
          {/* Edit a transaction modal + button */}
          <EditTransactionModal transaction={transaction}>
            {({ onOpen }) => (
              <IconButton
                colorScheme="blue"
                aria-label="Edit"
                icon={<EditIcon />}
                onClick={onOpen}
              />
            )}
          </EditTransactionModal>
          {/* Delete a traditional modal + button */}
          <DeleteTransactionModal transaction={transaction}>
            {({ onOpen }) => (
              <IconButton
                colorScheme="red"
                aria-label="Delete"
                icon={<DeleteIcon />}
                onClick={onOpen}
              />
            )}
          </DeleteTransactionModal>
        </Flex>
      </Td>
      <Td>
        <Text as="em" fontSize="sm" color="gray">
          {toReadableDate(transaction.created_at.toDate())}
        </Text>
      </Td>
      <Td>
        <Text as="p" fontSize="sm">
          {transaction.label}
        </Text>
      </Td>
      <Td isNumeric>
        <Text
          color={getAmountColor(
            transaction.amount * (transaction.isAddition ? 1 : -1)
          )}
        >
          {transaction.isAddition ? "+" : "-"} ${transaction.amount}
        </Text>
        {/* The intersection observer that triggers the fetch of more results */}
        {children}
      </Td>
    </Tr>
  );
}
