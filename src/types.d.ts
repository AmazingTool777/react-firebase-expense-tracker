import { UserCredential } from "firebase/auth";
import { Timestamp } from "firebase/firestore";

export type FirestoreDocument<TAttributes> = { id: string } & TAttributes;

export type UserAttributes = {
  fullName: string;
  accountId: string;
};

export type User = FirestoreDocument<UserAttributes>;

export type TransactionAttributes = {
  amount: number;
  isAddition: boolean;
  label: string;
  created_at: Timestamp;
};

export type Transaction = FirestoreDocument<TransactionAttributes>;

export interface GoogleAuthUserCredential extends UserCredential {
  _tokenResponse: {
    isNewUser?: boolean;
  };
}
