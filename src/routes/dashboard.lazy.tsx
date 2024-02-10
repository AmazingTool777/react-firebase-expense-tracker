import { Box, Card, Flex, Heading, Spinner, Text } from "@chakra-ui/react";
import { createLazyFileRoute } from "@tanstack/react-router";
import {
  addDoc,
  getAggregateFromServer,
  query,
  serverTimestamp,
  sum,
  where,
} from "firebase/firestore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import AddRecordForm, {
  AddRecordFormSubmitPayload,
} from "../components/AddRecordForm";
import { auth, collectionsRefs } from "../firebase";

export const Route = createLazyFileRoute("/dashboard")({
  component: Dashboard,
});

export const BALANCE_QUERY_KEY = "Balance";

function Dashboard() {
  const queryClient = useQueryClient();

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

  // Balance query
  const { data: balance, isLoading: balanceIsLoading } = useQuery({
    queryKey: [BALANCE_QUERY_KEY],
    async queryFn() {
      const [incomesSumSnapshot, expensesSumSnapshot] = await Promise.all([
        // Sum of all incomes
        getTransactionsSumQuery(true),
        // Sum of all expenses
        getTransactionsSumQuery(false),
      ]);
      return incomesSumSnapshot.data().sum - expensesSumSnapshot.data().sum;
    },
  });

  const balanceColor = !balance ? "gray" : balance > 0 ? "green" : "red";

  // Mutation: Record creation
  const { mutate, isPending } = useMutation({
    mutationFn(payload: AddRecordFormSubmitPayload) {
      return addDoc(collectionsRefs.transactions, {
        ...payload,
        accountId: auth.currentUser?.uid,
        created_at: serverTimestamp(),
      });
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [BALANCE_QUERY_KEY],
      });
    },
  });

  return (
    <>
      <Heading as="h1" size="xl" mb="1.5rem">
        Dashboard
      </Heading>
      {/* New record creation form */}
      <Box mb="1.5rem">
        <AddRecordForm isSubmitting={isPending} onSubmit={mutate} />
      </Box>
      {/* Balance card */}
      <Card as="section" aria-labelledby="balance-title" p="1rem">
        <Flex justifyContent="space-between" alignItems="center">
          <Heading id="balance-title" as="h3" size="lg">
            Balance:
          </Heading>
          {balanceIsLoading ? (
            <Spinner />
          ) : (
            <Text as="strong" color={balanceColor} fontSize="2xl">
              ${balance}
            </Text>
          )}
        </Flex>
      </Card>
      {/* <section>
        <Heading as="h2" size="lg" mb="1rem">
          Transactions
        </Heading>
      </section> */}
    </>
  );
}
