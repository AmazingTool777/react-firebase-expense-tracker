import { Heading } from "@chakra-ui/react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { addDoc, serverTimestamp } from "firebase/firestore";
import { useMutation } from "@tanstack/react-query";

import AddRecordForm, {
  AddRecordFormSubmitPayload,
} from "../components/AddRecordForm";
import { auth, collectionsRefs } from "../firebase";

export const Route = createLazyFileRoute("/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  // Mutation: Record creation
  const { mutate, isPending } = useMutation({
    mutationFn(payload: AddRecordFormSubmitPayload) {
      return addDoc(collectionsRefs.transactions, {
        ...payload,
        accountId: auth.currentUser?.uid,
        created_at: serverTimestamp(),
      });
    },
  });

  return (
    <>
      <Heading as="h1" size="xl" mb="1.5rem">
        Dashboard
      </Heading>
      <AddRecordForm isSubmitting={isPending} onSubmit={mutate} />
    </>
  );
}
