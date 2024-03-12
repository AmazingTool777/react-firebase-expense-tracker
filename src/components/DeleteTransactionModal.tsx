import React from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { deleteDoc, doc } from "firebase/firestore";

import { Transaction } from "../types";
import { db } from "../firebase";
import useReactQueryClientUtils from "../hooks/useQueryClientUtils";

export type DeleteTransactionModalRenderPropsParams = {
  onOpen(): void;
};

export type DeleteTransactionModalProps = {
  children?(params: DeleteTransactionModalRenderPropsParams): React.ReactNode;
  transaction: Transaction;
};

export default function DeleteTransactionModal({
  children,
  transaction,
}: DeleteTransactionModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { invalidateQueries } = useReactQueryClientUtils();
  // Mutation: Delete a transaction
  const { mutate, isPending } = useMutation({
    mutationFn(transaction: Transaction) {
      return deleteDoc(doc(db, "transactions", transaction.id));
    },
    onSuccess() {
      invalidateQueries();
    },
    onError(error) {
      console.log({ error });
    },
  });

  function handleSubmit() {
    mutate(transaction, {
      onSuccess() {
        onClose();
      },
    });
  }

  return (
    <>
      {children && children({ onOpen })}
      <Modal isOpen={isOpen} isCentered onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete the transaction</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Do you really want to delete the transaction?</ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button
              colorScheme="red"
              isLoading={isPending}
              onClick={handleSubmit}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
