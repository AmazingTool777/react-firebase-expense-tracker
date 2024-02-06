import { Container, Flex, Heading, Link } from "@chakra-ui/react";
import { Link as RouterLink } from "@tanstack/react-router";

export default function AppBar() {
  return (
    <Container bgColor="white">
      <Flex height="4rem" justifyContent="space-between" alignItems="center">
        <Heading size="md">🧾 Expense tracker</Heading>
        <Flex alignItems="center" gap="1rem">
          <Link as={RouterLink} to="/">
            Sign in
          </Link>
          <Link as={RouterLink} to="/signup">
            Sign up
          </Link>
        </Flex>
      </Flex>
    </Container>
  );
}
