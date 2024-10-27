import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";

import userEvent from "@testing-library/user-event";
import App from "../App";

const createRestaurantData = ({
  id,
  name,
  description,
  address,
  score,
  contactEmail,
}: {
  id: string;
  name: string;
  description: string;
  address?: string;
  contactEmail?: string;
  score?: string;
}) => ({
  id,
  name,
  shortDescription: description,
  cuisine: "French",
  rating: 4.7,
  details: {
    id: 1,
    address: address ?? "123 Fine St, London",
    openingHours: {
      weekday: "12:00 PM - 10:00 PM",
      weekend: "11:00 AM - 11:00 PM",
    },
    reviewScore: score ?? "4.7",
    contactEmail: contactEmail ?? "info@gourmetkitchen.com",
  },
});

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("Acceptant Test", () => {
  it("shows a list of restaurants, selecting one", async () => {
    /////////// Displaying a list of restaurants /////////////
    const address = "This is the fake address";
    const score = "3.1";
    const contactEmail = "contact@restaurant4.com";
    const restaurants = [
      { name: "Peru Fusion", description: "peru description 1" },
      {
        name: "Gourmet Kitchen",
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
    await userEvent.click(selectedRestaurant);

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
  });
});

function renderComponent() {
  return render(<App />);
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
