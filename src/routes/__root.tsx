import { type PropsWithChildren } from "react";
import { createRootRoute, Outlet, redirect } from "@tanstack/react-router";

import useAuthStore from "../stores/auth.store";
import AppBar from "../components/AppBar";
import { Box, Container } from "@chakra-ui/react";
import AuthSetup from "../components/AuthSetup";

export function RootLayout({ children }: PropsWithChildren) {
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

export const Route = createRootRoute({
  component: () => (
    <RootLayout>
      <Outlet />
    </RootLayout>
  ),
  async beforeLoad({ location }) {
    if (
      location.href === "/dashboard" &&
      !useAuthStore.getState().isAuthenticated
    ) {
      throw redirect({
        to: "/",
      });
    }
  },
});
