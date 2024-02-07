import { Link as RouterLink } from "@tanstack/react-router";
import { Button, Container, Flex, Heading, Link } from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";

import useAuthStore from "../stores/auth.store";

const activeLinkStyle: React.CSSProperties = {
  color: "var(--chakra-colors-teal-600)",
};

export default function AppBar() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const fullName = useAuthStore((state) => state.fullName);

  return (
    <Container bgColor="white">
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
              <Button colorScheme="red" rightIcon={<ArrowForwardIcon />}>
                Sign out
              </Button>
            </>
          )}
        </Flex>
      </Flex>
    </Container>
  );
}
