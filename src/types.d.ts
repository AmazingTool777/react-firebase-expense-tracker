import { UserCredential } from "firebase/auth";

export type FirestoreDocument<TAttributes> = { id: string } & TAttributes;

export type UserAttributes = {
  fullName: string;
  accountId: string;
};

export type User = FirestoreDocument<UserAttributes>;

export interface GoogleAuthUserCredential extends UserCredential {
  _tokenResponse: {
    isNewUser?: boolean;
  };
}
