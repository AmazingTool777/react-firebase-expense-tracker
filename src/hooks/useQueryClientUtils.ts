import { useQueryClient } from "@tanstack/react-query";

import {
  BALANCE_QUERY_KEY,
  TRANSACTIONS_QUERY_KEY,
} from "../constants/query-keys.constants";

export default function useReactQueryClientUtils() {
  const queryClient = useQueryClient();

  function invalidateQueries() {
    queryClient.invalidateQueries({
      queryKey: [BALANCE_QUERY_KEY],
    });
    queryClient.invalidateQueries({
      queryKey: [TRANSACTIONS_QUERY_KEY],
    });
  }

  return { queryClient, invalidateQueries };
}
