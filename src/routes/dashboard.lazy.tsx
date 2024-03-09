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
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { createLazyFileRoute } from "@tanstack/react-router";
import {
  DocumentSnapshot,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore";
import { useInfiniteQuery } from "@tanstack/react-query";

import { collectionsRefs } from "../firebase";
import { Transaction, TransactionAttributes } from "../types";
import AppIntersectionObserver from "../components/AppIntersectionObserver";
import BalanceCard from "../components/BalanceCard";
import TransactionRow from "../components/TransactionRow";
import AddRecordForm from "../components/AddRecordForm";

export const Route = createLazyFileRoute("/dashboard")({
  component: Dashboard,
});

export const BALANCE_QUERY_KEY = "Balance";
export const TRANSACTIONS_QUERY_KEY = "Transactions";
export const TRANSACTIONS_QUERY_LIMIT = 10;

const sortItemStyles = {
  color: `var(--chakra-colors-teal-700)`,
  backgroundColor: `var(--chakra-colors-teal-50)`,
};

function Dashboard() {
  const [order, setOrder] = useState<"asc" | "desc">("desc");

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
        <AddRecordForm />
      </Box>
      {/* Balance card */}
      <BalanceCard />
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
                <TransactionRow transaction={transaction}>
                  {/* The intersection observer that triggers the fetch of more results */}
                  {transactionsCount - 1 === i && (
                    <AppIntersectionObserver onIntersect={handleEndOfScroll} />
                  )}
                </TransactionRow>
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
