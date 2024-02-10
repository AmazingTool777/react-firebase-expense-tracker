import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
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
import { IconButton } from "@chakra-ui/react";
import { ChevronDownIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { createLazyFileRoute } from "@tanstack/react-router";
import {
  DocumentSnapshot,
  addDoc,
  doc,
  getAggregateFromServer,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
  sum,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";

import AddRecordForm, {
  AddRecordFormSubmitPayload,
} from "../components/AddRecordForm";
import { auth, collectionsRefs, db } from "../firebase";
import { Transaction, TransactionAttributes } from "../types";
import { toReadableDate } from "../utils/date-time.utils";
import AppIntersectionObserver from "../components/AppIntersectionObserver";
import EditTransactionModal, {
  EditRecordFormSubmitPayload,
} from "../components/EditTransactionModal";

export const Route = createLazyFileRoute("/dashboard")({
  component: Dashboard,
});

export const BALANCE_QUERY_KEY = "Balance";
export const TRANSACTIONS_QUERY_KEY = "Transactions";
export const TRANSACTIONS_QUERY_LIMIT = 10;

type EditTransactionMutationPayload = {
  transaction: Transaction;
  payload: EditRecordFormSubmitPayload;
};

const sortItemStyles = {
  color: `var(--chakra-colors-teal-700)`,
  backgroundColor: `var(--chakra-colors-teal-50)`,
};

function Dashboard() {
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  const queryClient = useQueryClient();

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

  const balanceColor = balanceSummary
    ? getAmountColor(balanceSummary.balance)
    : "gray";

  // Transactions query
  const {
    data: transactionsData,
    isFetchingNextPage: isFetchingNextTransactionsPage,
    isLoading: transactionsAreLoading,
    hasNextPage: transactionsHaveNextPage,
    fetchNextPage: fetchNextTransactionsPage,
  } = useInfiniteQuery({
    queryKey: [TRANSACTIONS_QUERY_KEY, order],
    async queryFn({ pageParam: lastTransaction, queryKey }) {
      const queryParams: Parameters<typeof query> = [
        collectionsRefs.transactions,
        orderBy("created_at", queryKey[1] as "asc" | "desc"),
      ];
      if (lastTransaction) {
        queryParams.push(startAfter(lastTransaction));
      }
      queryParams.push(limit(TRANSACTIONS_QUERY_LIMIT));
      return getDocs(query(...queryParams));
    },
    initialPageParam: null as DocumentSnapshot<unknown> | null,
    getNextPageParam(lastPage) {
      return lastPage.docs[TRANSACTIONS_QUERY_LIMIT - 1] ?? null;
    },
  });
  // The merged transactions array from the query
  const transactions = useMemo<Transaction[]>(() => {
    if (!transactionsData) return [];
    const transactions: Transaction[] =
      transactionsData.pages?.flatMap<Transaction>((result) => {
        return result.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as TransactionAttributes),
        }));
      }) ?? [];
    return transactions;
  }, [transactionsData]);
  const transactionsCount = transactions.length;

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

  // Mutation: Edit a transaction
  const { isPending: isEditingTransaction, mutate: editTransaction } =
    useMutation({
      mutationFn({ payload, transaction }: EditTransactionMutationPayload) {
        return updateDoc(doc(db, "transactions", transaction.id), payload);
      },
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: [BALANCE_QUERY_KEY],
        });
        queryClient.invalidateQueries({
          queryKey: [TRANSACTIONS_QUERY_KEY],
        });
      },
      onError(error) {
        console.log({ error });
      },
    });

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

  function getAmountColor(amount: number) {
    return !amount ? "gray" : amount > 0 ? "green" : "red";
  }

  function handleEndOfScroll() {
    if (transactionsHaveNextPage) fetchNextTransactionsPage();
  }

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
      {/* Transactions records */}
      <Card as="section" pb="1rem">
        <Flex justifyContent="space-between" alignItems="flex-start" p="1rem">
          {/* Title */}
          <Heading as="h2" size="lg">
            Transactions
          </Heading>
          {/* Sort menu */}
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              Sort
            </MenuButton>
            <MenuList>
              <MenuItem
                style={order === "desc" ? sortItemStyles : undefined}
                onClick={() => setOrder("desc")}
              >
                Latest first
              </MenuItem>
              <MenuItem
                style={order === "asc" ? sortItemStyles : undefined}
                onClick={() => setOrder("asc")}
              >
                Oldest first
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
        {/* Table loader or Table */}
        {transactionsAreLoading ? (
          <Flex justifyContent="center">
            <Spinner />
          </Flex>
        ) : (
          <Table variant="simple">
            <TableCaption>Transactions records</TableCaption>
            <Thead>
              <Tr>
                <Th>Actions</Th>
                <Th>Added at</Th>
                <Th>Label</Th>
                <Th isNumeric>Amount</Th>
              </Tr>
            </Thead>
            <Tbody>
              {transactions.map((transaction, i) => (
                <Tr key={transaction.id}>
                  <Td>
                    <Flex columnGap="0.5rem">
                      {/* Edit a transaction modal + button */}
                      <EditTransactionModal
                        transaction={transaction}
                        isSubmitting={isEditingTransaction}
                        onSubmit={(transaction, payload) =>
                          editTransaction({ transaction, payload })
                        }
                      >
                        {({ onOpen }) => (
                          <IconButton
                            colorScheme="blue"
                            aria-label="Edit"
                            icon={<EditIcon />}
                            onClick={onOpen}
                          />
                        )}
                      </EditTransactionModal>
                      <IconButton
                        colorScheme="red"
                        aria-label="Delete"
                        icon={<DeleteIcon />}
                      />
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
                    {transactionsCount - 1 === i && (
                      <AppIntersectionObserver
                        onIntersect={handleEndOfScroll}
                      />
                    )}
                  </Td>
                </Tr>
              ))}
              {/* More results loader */}
              {isFetchingNextTransactionsPage && (
                <Tr>
                  <Td
                    textAlign="center"
                    color="gray"
                    fontSize="sm"
                    fontStyle="normal"
                    colSpan={4}
                  >
                    <Spinner />
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        )}
      </Card>
    </>
  );
}
