import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";

import AddRecordForm from "../../src/components/AddRecordForm";
import userEvent from "@testing-library/user-event";

type RenderComponentParams = {
  queryClient?: QueryClient;
};

describe("Create a new record form", () => {
  async function renderComponent(params: RenderComponentParams = {}) {
    const { queryClient = new QueryClient() } = params;

    render(
      <ChakraProvider>
        <QueryClientProvider client={queryClient}>
          <AddRecordForm />
        </QueryClientProvider>
      </ChakraProvider>
    );

    return {
      queryClient,
      heading: await screen.findByRole("heading", { name: /create/i }),
      labelInput: screen.getByPlaceholderText(/label/i),
      amountInput: screen.getByPlaceholderText(/amount/i),
      isIncomeRadio: screen.getByLabelText(/income/i),
      isExpenseRadio: screen.getByLabelText(/expense/i),
      submitButton: screen.getByRole("button", { name: /create/i }),
    };
  }

  it("should render the form elements with the initial states", async () => {
    const {
      heading,
      labelInput,
      amountInput,
      isIncomeRadio,
      isExpenseRadio,
      submitButton,
    } = await renderComponent();

    expect(heading).toBeInTheDocument();
    expect(labelInput).toBeInTheDocument();
    expect(amountInput).toHaveDisplayValue("0");
    expect(isIncomeRadio).toBeChecked();
    expect(isExpenseRadio).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it("should not accept negative values on the amount input", async () => {
    const { amountInput } = await renderComponent();

    const user = userEvent.setup();
    await user.type(amountInput, "-42");

    expect(amountInput).toHaveDisplayValue("42");
  });

  it("should be able to toggle between income and expense", async () => {
    const { isExpenseRadio, isIncomeRadio } = await renderComponent();

    const user = userEvent.setup();
    await user.click(isExpenseRadio);

    expect(isExpenseRadio).toBeChecked();

    await user.click(isIncomeRadio);

    expect(isIncomeRadio).toBeChecked();
  });

  it("should enable the submit button when the label is not empty and the amount has a value greater than 0", async () => {
    const { labelInput, amountInput, submitButton } = await renderComponent();

    const user = userEvent.setup();
    await user.type(labelInput, "New item");
    await user.type(amountInput, "10");

    expect(submitButton).toBeEnabled();
  });

  it("should disable the submit button during form submission", async () => {
    const { labelInput, amountInput, submitButton } = await renderComponent();

    const user = userEvent.setup();
    await user.type(labelInput, "New item");
    await user.type(amountInput, "10");
    await user.click(submitButton);

    expect(submitButton).toBeDisabled();
  });
});
