import { signInWithPopup } from "firebase/auth";
import { addDoc } from "firebase/firestore";
import { useNavigate } from "@tanstack/react-router";

import { auth, collectionsRefs, googleAuthProvider } from "../firebase";
import { GoogleAuthUserCredential } from "../types";

export type GoogleSignInHookParams = {
  onError?(error: unknown): void;
};

export default function useGoogleSignIn(params?: GoogleSignInHookParams) {
  const navigate = useNavigate();

  async function handleGoogleSignIn() {
    try {
      const userCrendential = (await signInWithPopup(
        auth,
        googleAuthProvider
      )) as GoogleAuthUserCredential;
      const fullName = userCrendential.user.displayName as string;
      if (userCrendential._tokenResponse.isNewUser) {
        try {
          addDoc(collectionsRefs.users, {
            fullName,
            accountId: userCrendential.user.uid,
          });
        } catch (error) {
          console.log(error);
        }
      }
      navigate({ to: "/dashboard" });
    } catch (error) {
      params?.onError && params.onError(error);
    }
  }

  return { handleGoogleSignIn };
}
