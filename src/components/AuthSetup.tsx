import { PropsWithChildren, useEffect } from "react";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { getDocs, query, where } from "firebase/firestore";

import useAuthStore from "../stores/auth.store";
import { auth, collectionsRefs } from "../firebase";
import { UserAttributes } from "../types";

export default function AuthSetup({ children }: PropsWithChildren) {
  const router = useRouter();
  const navigate = useNavigate();

  const setAuthenticated = useAuthStore((s) => s.setAuthenticated);
  const setFullName = useAuthStore((s) => s.setFullName);

  useEffect(() => {
    return auth.onAuthStateChanged(async (user) => {
      setAuthenticated(!!user, user?.displayName);
      if (user) {
        if (!user.displayName) {
          // Getting the associated user data
          getDocs(
            query(collectionsRefs.users, where("accountId", "==", user.uid))
          ).then((usersDocs) => {
            usersDocs.forEach((doc) => {
              setFullName((doc.data() as UserAttributes).fullName);
            });
          });
        }
        if (router.state.resolvedLocation.href !== "/dashboard") {
          navigate({ to: "/dashboard" });
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return children;
}
