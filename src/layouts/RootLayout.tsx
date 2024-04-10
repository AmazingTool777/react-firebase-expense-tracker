import { type PropsWithChildren } from "react";

import AppBar from "../components/AppBar";
import { Box, Container } from "@chakra-ui/react";
import AuthSetup from "../components/AuthSetup";

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <AuthSetup>
      <Box bgColor="gray.200" minH="100vh" pb="3rem">
        <AppBar />
        <Container mt="1.5rem" maxW="48rem">
          {children}
        </Container>
      </Box>
    </AuthSetup>
  );
}
