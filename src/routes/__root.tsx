import { createRootRoute, Outlet, redirect } from "@tanstack/react-router";

import App from "../App";
import useAuthStore from "../stores/auth.store";

export const Route = createRootRoute({
  component: () => (
    <App>
      <Outlet />
    </App>
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
