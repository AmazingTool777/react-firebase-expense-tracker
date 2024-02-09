import { Link as RouterLink, useNavigate } from "@tanstack/react-router";
import { signOut } from "firebase/auth";
import { Button, Container, Flex, Heading, Link } from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";

import useAuthStore from "../stores/auth.store";
import { auth } from "../firebase";

const activeLinkStyle: React.CSSProperties = {
  color: "var(--chakra-colors-teal-600)",
};

export default function AppBar() {
  const navigate = useNavigate();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const fullName = useAuthStore((state) => state.fullName);

  async function handleSignout() {
    await signOut(auth);
    navigate({ to: "/" });
  }

  return (
    <Container bgColor="white" position="sticky" top="0">
      <Flex height="4rem" justifyContent="space-between" alignItems="center">
        <Heading size="md">🧾 Expense tracker</Heading>
        <Flex alignItems="center" gap="1rem">
          {!isAuthenticated ? (
            <>
              <Link
                as={RouterLink}
                to="/"
                activeOptions={{ exact: true }}
                activeProps={{ style: activeLinkStyle }}
              >
                Sign in
              </Link>
              <Link
                as={RouterLink}
                to="/signup"
                activeProps={{ style: activeLinkStyle }}
              >
                Sign up
              </Link>
            </>
          ) : (
            <>
              <span>{fullName ?? "..."}</span>
              <Button
                colorScheme="red"
                rightIcon={<ArrowForwardIcon />}
                onClick={handleSignout}
              >
                Sign out
              </Button>
            </>
          )}
        </Flex>
      </Flex>
    </Container>
  );
}
