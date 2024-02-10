import { initializeApp } from "firebase-admin/app";
import { onDocumentWritten } from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";

initializeApp();

export const updateBalanceOnTransactionWrite = onDocumentWritten(
  "/transactions/{transactionId}",
  (event) => {
    logger.info({
      before: event.data?.before.data(),
      after: event.data?.after.data(),
    });
    return Promise.resolve();
  }
);
