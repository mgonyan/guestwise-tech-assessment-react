import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BookTable from "../BookTable";

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.restoreAllMocks();
});

afterAll(() => {
  jest.useRealTimers();
});

const formData = {
  name: "John Doe",
  email: "j@gmail.com",
  phone: "07123456789",
  date: "2020-01-02",
  time: "13:00",
  guests: "2",
};

describe("<BookTable />", () => {
  it("handles server errors", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });

    render(<BookTable />);

    const nameInput = screen.getByLabelText("Name");
    const emailInput = screen.getByLabelText("Email");
    const phoneNumberInput = screen.getByLabelText("Phone");
    const dateInput = screen.getByLabelText("Date");
    const timeInput = screen.getByLabelText("Time");
    const guestsInput = screen.getByLabelText("Guests");

    await userEvent.type(nameInput, formData.name);
    await userEvent.type(emailInput, formData.email);
    await userEvent.type(phoneNumberInput, formData.phone);
    await userEvent.type(dateInput, formData.date); // Tomorrow according fake timer
    await userEvent.type(timeInput, formData.time); // An hour in the future according fake timer
    await userEvent.type(guestsInput, formData.guests);

    const submitButton = screen.getByRole("button", { name: "Book" });
    await userEvent.click(submitButton);

    expect(await screen.findByText(/Booking failed/)).toBeInTheDocument();

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
  it("handles network errors", async () => {
    const mockError = new Error("Network Error");
    (global.fetch as jest.Mock).mockRejectedValueOnce(mockError);

    render(<BookTable />);

    const nameInput = screen.getByLabelText("Name");
    const emailInput = screen.getByLabelText("Email");
    const phoneNumberInput = screen.getByLabelText("Phone");
    const dateInput = screen.getByLabelText("Date");
    const timeInput = screen.getByLabelText("Time");
    const guestsInput = screen.getByLabelText("Guests");

    await userEvent.type(nameInput, formData.name);
    await userEvent.type(emailInput, formData.email);
    await userEvent.type(phoneNumberInput, formData.phone);
    await userEvent.type(dateInput, formData.date); // Tomorrow according fake timer
    await userEvent.type(timeInput, formData.time); // An hour in the future according fake timer
    await userEvent.type(guestsInput, formData.guests);

    const submitButton = screen.getByRole("button", { name: "Book" });
    await userEvent.click(submitButton);

    expect(
      await screen.findByText(/Something went wrong: "Error: Network Error"/)
    ).toBeInTheDocument();

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});
