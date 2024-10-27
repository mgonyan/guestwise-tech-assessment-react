import { render, screen } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import BookTable from "../BookTable";

let user: UserEvent;

beforeAll(() => {
  jest.useFakeTimers().setSystemTime(new Date("2020-01-01T12:00:00Z"));
  user = userEvent.setup({
    advanceTimers: () => jest.runOnlyPendingTimers(),
  });
});

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

    renderComponent();

    const nameInput = screen.getByLabelText("Name");
    const emailInput = screen.getByLabelText("Email");
    const phoneNumberInput = screen.getByLabelText("Phone");
    const dateInput = screen.getByLabelText("Date");
    const timeInput = screen.getByLabelText("Time");
    const guestsInput = screen.getByLabelText("Guests");

    await user.type(nameInput, formData.name);
    await user.type(emailInput, formData.email);
    await user.type(phoneNumberInput, formData.phone);
    await user.type(dateInput, formData.date); // Tomorrow according fake timer
    await user.type(timeInput, formData.time); // An hour in the future according fake timer
    await user.type(guestsInput, formData.guests);

    const submitButton = screen.getByRole("button", { name: "Book" });
    await user.click(submitButton);

    expect(await screen.findByText(/Booking failed/)).toBeInTheDocument();

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
  it("handles network errors", async () => {
    const mockError = new Error("Network Error");
    (global.fetch as jest.Mock).mockRejectedValueOnce(mockError);

    renderComponent();

    const nameInput = screen.getByLabelText("Name");
    const emailInput = screen.getByLabelText("Email");
    const phoneNumberInput = screen.getByLabelText("Phone");
    const dateInput = screen.getByLabelText("Date");
    const timeInput = screen.getByLabelText("Time");
    const guestsInput = screen.getByLabelText("Guests");

    await user.type(nameInput, formData.name);
    await user.type(emailInput, formData.email);
    await user.type(phoneNumberInput, formData.phone);
    await user.type(dateInput, formData.date); // Tomorrow according fake timer
    await user.type(timeInput, formData.time); // An hour in the future according fake timer
    await user.type(guestsInput, formData.guests);

    const submitButton = screen.getByRole("button", { name: "Book" });
    await user.click(submitButton);

    expect(
      await screen.findByText(/Something went wrong: "Error: Network Error"/)
    ).toBeInTheDocument();

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
  describe("Validation", () => {
    it("validates bookings must be scheduled for at least 1 hour in the future and cannot be set for the past", async () => {
      renderComponent();

      const dateInput = screen.getByLabelText("Date");
      const timeInput = screen.getByLabelText("Time");

      await user.type(dateInput, "2019-12-31"); // Yesterday according fake timer
      await user.type(timeInput, "12:00"); // Same day according fake timer

      const submitButton = screen.getByRole("button", { name: "Book" });
      await user.click(submitButton);

      const timeError = await screen.findByText(
        /must be scheduled for at least 1 hour in the future/
      );
      expect(timeError).toBeInTheDocument();

      const dateError = await screen.findByText(/cannot be set for the past/);
      expect(dateError).toBeInTheDocument();
    });
    it("validates Limit bookings to a maximum of 12 people", async () => {
      renderComponent();

      const guestsPhoneNumberInput = screen.getByLabelText("Guests");

      const invalidNumberOfGuests = "13";
      await user.type(guestsPhoneNumberInput, invalidNumberOfGuests);

      const submitButton = screen.getByRole("button", { name: "Book" });
      await user.click(submitButton);

      const error = await screen.findByText(
        /invalid number of guests \(max is 12\)/
      );
      expect(error).toBeInTheDocument();
    });
    it("validates the presence of required fields (name, email, phone)", async () => {
      renderComponent();

      const submitButton = screen.getByRole("button", { name: "Book" });
      await user.click(submitButton);

      expect(
        await screen.findByText(/email is a required field/)
      ).toBeInTheDocument();

      expect(
        await screen.findByText(/name is a required field/)
      ).toBeInTheDocument();

      expect(
        await screen.findByText(/phone is a required field/)
      ).toBeInTheDocument();

      expect(
        await screen.findByText(/guests is a required field/)
      ).toBeInTheDocument();

      expect(
        await screen.findByText(/must be a valid time/)
      ).toBeInTheDocument();

      expect(
        await screen.findByText(/must be a valid date/)
      ).toBeInTheDocument();
    });
    it.each(["email", "a", "email@", "123"])(
      "validates the email %p field is valid email address",
      async (email) => {
        renderComponent();

        const emailInput = screen.getByLabelText("Email");

        await user.type(emailInput, email);
        // Tab out of the input field
        await user.tab();

        const error = await screen.findByText(/must be a valid email/);
        expect(error).toBeInTheDocument();
      }
    );
    it.each(["aaaa", "1", "23"])(
      "validates the phone field must be a valid phone number",
      async (phone) => {
        renderComponent();

        const phoneNumberInput = screen.getByLabelText("Phone");

        await user.type(phoneNumberInput, phone);
        // Tab out of the input field
        await user.tab();

        const error = await screen.findByText(/must be a valid UK number/);
        expect(error).toBeInTheDocument();
      }
    );
  });
});

function renderComponent() {
  return render(<BookTable />);
}
