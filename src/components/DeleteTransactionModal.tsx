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
import { Transaction } from "../types";

export type DeleteTransactionModalRenderPropsParams = {
  onOpen(): void;
};

export type DeleteTransactionModalProps = {
  children?(params: DeleteTransactionModalRenderPropsParams): React.ReactNode;
  transaction: Transaction;
  onSubmit?(transaction: Transaction): void;
};

export default function DeleteTransactionModal({
  children,
  transaction,
  onSubmit,
}: DeleteTransactionModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  function handleSubmit() {
    onSubmit && onSubmit(transaction);
    onClose();
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
            <Button colorScheme="red" onClick={handleSubmit}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
