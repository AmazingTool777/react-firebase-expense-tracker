import { createLazyFileRoute } from "@tanstack/react-router";

import SignInPage from "../pages/SignInPage";

export const Route = createLazyFileRoute("/")({
  component: SignInPage,
});
