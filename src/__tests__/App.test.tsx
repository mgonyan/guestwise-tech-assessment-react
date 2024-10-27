import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";

import App from "../App";
import { createRestaurantData } from "../testUtils";

const formData = {
  name: "John Doe",
  email: "j@gmail.com",
  phone: "07123456789",
  date: "2020-01-02",
  time: "13:00",
  guests: "2",
};

let user: UserEvent;

beforeAll(() => {
  // This is to fake the time to be 2020-01-01 12:00:00
  // avoiding the need to wait for the date to be tomorrow
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

describe("Acceptant Test", () => {
  it("shows a list of restaurants, selecting one and book a table", async () => {
    /////////// Displaying a list of restaurants /////////////
    const name = "Gourmet Kitchen";
    const address = "This is the fake address";
    const score = "3.1";
    const contactEmail = "contact@restaurant4.com";
    const restaurants = [
      { name: "Peru Fusion", description: "peru description 1" },
      {
        name,
        description: "gourmet description",
        address,
        score,
        contactEmail,
      },
      { name: "Burger Place", description: "burger description" },
    ];
    const mockRestaurants = restaurants.map((props, index) =>
      createRestaurantData({ id: index.toString(), ...props })
    );

    // Given: A List of restaurant
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockRestaurants),
    });

    // When: The app is rendered
    renderComponent();

    // Then: The loader is displayed
    const loader = await screen.findByText(/loading/i);
    await waitForElementToBeRemoved(loader);

    // Then: The restaurant list is displayed
    restaurants.forEach(({ name, description }) => {
      const restaurantName = screen.getByRole("heading", {
        name: RegExp(name, "i"),
      });
      const restaurantDescription = screen.getByText(RegExp(description, "i"));
      expect(restaurantName).toBeInTheDocument();
      expect(restaurantDescription).toBeInTheDocument();
    });

    //////////////// Search and sort ///////////////////////
    // When: A user searches for a restaurant

    const filterInput = await screen.findByRole("textbox", {
      name: /filter restaurant/i,
    });

    // When: Filter the list by "Gourmet Kitchen"
    await user.type(filterInput, name);

    // There: Only the restaurant "Gourmet Kitchen" should be displayed
    await waitFor(() =>
      expect(screen.queryAllByRole("listitem")).toHaveLength(1)
    );

    // // And: Clear the filters
    const clearFilterLink = await screen.findByText(/clear filters/i);
    await user.click(clearFilterLink);

    // // All the restaurants should be displayed
    await waitFor(() =>
      expect(screen.queryAllByRole("listitem")).toHaveLength(3)
    );

    //////////////// Selecting a restaurant ////////////////
    // Resolves /restaurant/1
    (global.fetch as jest.Mock).mockImplementationOnce(async () => {
      await delay(10); // 100s delay to give time for the spinner to appear
      return { json: async () => mockRestaurants[1] };
    });

    // When: A restaurant is selected
    const restaurant = restaurants[1];
    const selectedRestaurant = screen.getByRole("heading", {
      name: RegExp(restaurant.name, "i"),
    });
    await user.click(selectedRestaurant);

    // Then: The component renders the loading state while fetching the data
    const detailsLoader = await screen.findByText(/loading/i);
    await waitForElementToBeRemoved(detailsLoader);

    // And: The component should display the restaurant details when loaded
    expect(
      await screen.findByText(new RegExp(`Address: ${address}`, "i"))
    ).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(`Review Score: ${score}`, "i"))
    ).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(`Contact: ${contactEmail}`, "i"))
    ).toBeInTheDocument();

    //////////////// Booking a table ////////////////
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
    });

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

    expect(await screen.findByText(/booking successful/i)).toBeInTheDocument();

    expect(global.fetch).toHaveBeenCalledTimes(3);
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:3001/bookings",
      {
        body: JSON.stringify({ ...formData }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      }
    );
  });
});

function renderComponent() {
  return render(<App />);
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
