import { createRootRoute, Outlet, redirect } from "@tanstack/react-router";

import useAuthStore from "../stores/auth.store";
import RootLayout from "../layouts/RootLayout";

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
