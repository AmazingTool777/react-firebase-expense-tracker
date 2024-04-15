import { render, screen, waitFor } from "@testing-library/react";
import { RouterProvider } from "@tanstack/react-router";
import userEvent from "@testing-library/user-event";

import SignInPage from "../../src/pages/SignInPage";
import { TestPageRouterFactory } from "../test-page-router.factory";

describe("Sign up page", () => {
  async function renderPage() {
    const router = TestPageRouterFactory.create(SignInPage);
    render(<RouterProvider router={router} />);

    const getHeading = () => screen.getByRole("heading");
    const getEmailInput = () => screen.getByLabelText(/e-?mail/i);
    const getPasswordInput = () => screen.getByLabelText(/password/i);
    const getSubmitButton = () =>
      screen.getByRole("button", { name: /submit/i });
    const getGoogleSignInButton = () =>
      screen.getByRole("button", { name: /with google/i });

    // Waiting for the page to be rendered as tanstack router won't render the index route immediatly
    await waitFor(() => expect(getHeading()).toBeInTheDocument());

    return {
      heading: getHeading(),
      emailInput: getEmailInput(),
      passwordInput: getPasswordInput(),
      submitButton: getSubmitButton(),
      googleSignInButton: getGoogleSignInButton(),
      getHeading,
      getEmailInput,
      getPasswordInput,
      getSubmitButton,
      getGoogleSignInButton,
    };
  }

  it("should render the heading, the correct form elements and the google sign in button", async () => {
    const {
      heading,
      emailInput,
      passwordInput,
      submitButton,
      googleSignInButton,
    } = await renderPage();

    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(/sign in/i);
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
    expect(googleSignInButton).toBeInTheDocument();
  });

  it("should display empty field error message if empty inputs after the submit button is clicked", async () => {
    const { submitButton } = await renderPage();

    const user = userEvent.setup();
    await user.click(submitButton);

    expect(screen.getByText(/e-?mail.*required/i)).toBeInTheDocument();
    expect(screen.getByText(/password.*required/i)).toBeInTheDocument();
  });

  it("should disable the form inputs, the submit button and the google sign in button after the form has been submitted and the form is filled", async () => {
    const { submitButton, emailInput, passwordInput } = await renderPage();

    const user = userEvent.setup();
    await user.type(emailInput, "user@test.com");
    await user.type(passwordInput, "123");
    await user.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(emailInput).toBeDisabled();
    expect(passwordInput).toBeDisabled();
  });

  it("should display the appropriate error message after submitting wrong crendentials", async () => {
    const { submitButton, emailInput, passwordInput } = await renderPage();

    const user = userEvent.setup();
    await user.type(emailInput, "user@test.com");
    await user.type(passwordInput, "123");
    await user.click(submitButton);
    await waitFor(() => expect(submitButton).toBeEnabled(), { timeout: 3000 });

    expect(screen.getByText(/wrong credentials/i)).toBeInTheDocument();
  });
});
