import { RouterProvider } from "@tanstack/react-router";
import { render, screen, waitFor } from "@testing-library/react";

import SignupPage from "../../src/pages/SignUpPage";
import { TestPageRouterFactory } from "../test-page-router.factory";
import userEvent from "@testing-library/user-event";

describe("Sign up page", () => {
  async function renderPage() {
    const router = TestPageRouterFactory.create(SignupPage);
    render(<RouterProvider router={router} />);

    return {
      heading: await screen.findByRole("heading", { name: /sign up/i }),
      fullNameInput: screen.getByLabelText(/full name/i),
      emailInput: screen.getByLabelText(/e-?mail/i),
      passwordInput: screen.getByLabelText(/^password$/i),
      passwordConfirmationInput: screen.getByLabelText(
        /(confirm.*\spassword|password confirmation)/i
      ),
      submitButton: screen.getByRole("button", { name: /submit/i }),
      googleSignInButton: screen.getByRole("button", { name: /with google/i }),
    };
  }

  it("should render the form elements and the google sign in button", async () => {
    const {
      heading,
      fullNameInput,
      emailInput,
      passwordInput,
      passwordConfirmationInput,
      submitButton,
      googleSignInButton,
    } = await renderPage();

    expect(heading).toBeInTheDocument();
    expect(fullNameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(passwordConfirmationInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
    expect(googleSignInButton).toBeInTheDocument();
  });

  it("should display the appropriate error messages if the form inputs are empty after form submission", async () => {
    const { submitButton } = await renderPage();

    const user = userEvent.setup();
    await user.click(submitButton);

    expect(screen.getByText(/must.+full name/i)).toBeInTheDocument();
    expect(screen.getByText(/must.+e-?mail/i)).toBeInTheDocument();
    expect(screen.getByText(/must.+password/i)).toBeInTheDocument();
  });

  it("should display the appropriate error message if password not confirmed after form submission", async () => {
    const { submitButton, passwordInput } = await renderPage();

    const user = userEvent.setup();
    await user.type(passwordInput, "123456");
    await user.click(submitButton);

    expect(screen.getByText(/must confirm.+password/i)).toBeInTheDocument();
  });

  it("should display the appropriate error message if given wrong password confirmation after form submission", async () => {
    const { submitButton, passwordInput, passwordConfirmationInput } =
      await renderPage();

    const user = userEvent.setup();
    await user.type(passwordInput, "123456");
    await user.type(passwordConfirmationInput, "dsfsdf");
    await user.click(submitButton);

    expect(
      screen.getByText(/password confirmation.+wrong/i)
    ).toBeInTheDocument();
  });

  it("should disable the form elements and the google sign in button during form submission", async () => {
    const {
      fullNameInput,
      emailInput,
      passwordInput,
      passwordConfirmationInput,
      submitButton,
    } = await renderPage();

    const user = userEvent.setup();
    await user.type(fullNameInput, "Test User");
    // Make sure you have already created a user that has the email `user@test.com`
    await user.type(emailInput, "user@test.com");
    await user.type(passwordInput, "123456");
    await user.type(passwordConfirmationInput, "123456");
    await user.click(submitButton);

    expect(fullNameInput).toBeDisabled();
    expect(emailInput).toBeDisabled();
    expect(passwordInput).toBeDisabled();
    expect(passwordConfirmationInput).toBeDisabled();
    expect(submitButton).toBeDisabled();
  });

  it("should display the appropriate message if a duplicate email was submitted", async () => {
    const {
      fullNameInput,
      emailInput,
      passwordInput,
      passwordConfirmationInput,
      submitButton,
    } = await renderPage();

    const user = userEvent.setup();
    await user.type(fullNameInput, "Test User");
    // Make sure you have already created a user that has the email `user@test.com`
    await user.type(emailInput, "user@test.com");
    await user.type(passwordInput, "123456");
    await user.type(passwordConfirmationInput, "123456");
    await user.click(submitButton);
    await waitFor(() => expect(submitButton).toBeEnabled());

    expect(screen.getByText(/e-?mail.*\staken/i)).toBeInTheDocument();
  });
});
