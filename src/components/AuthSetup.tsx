import { PropsWithChildren, useEffect } from "react";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { getDocs, query, where } from "firebase/firestore";

import useAuthStore from "../stores/auth.store";
import { auth, collectionsRefs } from "../firebase";
import { UserAttributes } from "../types";

export default function AuthSetup({ children }: PropsWithChildren) {
  const router = useRouter();
  const navigate = useNavigate();

  const fullName = useAuthStore((s) => s.fullName);
  const setAuthenticated = useAuthStore((s) => s.setAuthenticated);
  const setUserId = useAuthStore((s) => s.setUserId);

  useEffect(() => {
    return auth.onAuthStateChanged(async (user) => {
      if (user) {
        const authUserDocs = await getDocs(
          query(collectionsRefs.users, where("accountId", "==", user?.uid))
        );
        if (fullName) {
          setAuthenticated(true, fullName);
        } else {
          setAuthenticated(
            true,
            (authUserDocs.docs[0].data() as UserAttributes).fullName
          );
        }
        setUserId(authUserDocs.docs[0].id);
        if (router.state.resolvedLocation.href !== "/dashboard") {
          navigate({ to: "/dashboard" });
        }
      } else {
        setAuthenticated(false, null);
      }
    });
  }, [
    fullName,
    navigate,
    router.state.resolvedLocation.href,
    setAuthenticated,
    setUserId,
  ]);

  return children;
}
