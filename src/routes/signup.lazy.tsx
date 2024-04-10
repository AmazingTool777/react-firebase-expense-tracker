import { createLazyFileRoute } from "@tanstack/react-router";

import SignupPage from "../pages/SignUpPage";

export const Route = createLazyFileRoute("/signup")({
  component: SignupPage,
});
