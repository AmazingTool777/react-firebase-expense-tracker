import {
  Box,
  Card,
  Flex,
  Heading,
  Spinner,
  Table,
  TableCaption,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { BALANCE_QUERY_KEY } from "../constants/query-keys.constants";
import useColors from "../hooks/useColors";
import { getAggregateFromServer, query, sum, where } from "firebase/firestore";
import { auth, collectionsRefs } from "../firebase";

export default function BalanceCard() {
  // Balance query
  const { data: balanceSummary, isLoading: balanceIsLoading } = useQuery<
    Record<"incomes" | "expenses" | "balance", number>
  >({
    queryKey: [BALANCE_QUERY_KEY],
    async queryFn() {
      const [incomesSumSnapshot, expensesSumSnapshot] = await Promise.all([
        // Sum of all incomes
        getTransactionsSumQuery(true),
        // Sum of all expenses
        getTransactionsSumQuery(false),
      ]);
      const incomes = incomesSumSnapshot.data().sum;
      const expenses = expensesSumSnapshot.data().sum;
      return {
        balance: incomes - expenses,
        incomes,
        expenses,
      };
    },
  });

  const { getAmountColor } = useColors();
  const balanceColor = balanceSummary
    ? getAmountColor(balanceSummary.balance)
    : "gray";

  function getTransactionsSumQuery(isAddition: boolean) {
    return getAggregateFromServer(
      query(
        collectionsRefs.transactions,
        where("accountId", "==", auth.currentUser?.uid),
        where("isAddition", "==", isAddition)
      ),
      {
        sum: sum("amount"),
      }
    );
  }

  return (
    <Box mb="1.5rem">
      <Card as="section" aria-labelledby="balance-title" pb="1rem">
        <Flex
          justifyContent="space-between"
          alignItems="center"
          mb="1rem"
          p="1rem"
        >
          <Heading id="balance-title" as="h2" size="lg">
            Balance:
          </Heading>
          {balanceIsLoading || !balanceSummary ? (
            <Spinner />
          ) : (
            <Text as="strong" color={balanceColor} fontSize="2xl">
              ${balanceSummary.balance}
            </Text>
          )}
        </Flex>
        {balanceSummary && (
          <Table variant="simple">
            <TableCaption>Summary</TableCaption>
            <Thead>
              <Tr>
                <Th>Total Incomes</Th>
                <Th>Total Expenses</Th>
                <Th isNumeric>Balance</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>
                  <Text color="green">${balanceSummary.incomes}</Text>
                </Td>
                <Td>
                  <Text color="red">${balanceSummary.expenses}</Text>
                </Td>
                <Td isNumeric>
                  <Text color={balanceColor}>${balanceSummary.balance}</Text>
                </Td>
              </Tr>
            </Tbody>
          </Table>
        )}
      </Card>
    </Box>
  );
}
