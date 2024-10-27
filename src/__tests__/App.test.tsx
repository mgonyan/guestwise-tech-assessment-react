import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import App from "../App";

const createRestaurantData = ({
  id,
  name,
  description,
}: {
  id: string;
  name: string;
  description: string;
}) => ({
  id,
  name,
  shortDescription: description,
  cuisine: "French",
  rating: 4.7,
  details: {
    id: 1,
    address: "123 Fine St, London",
    openingHours: {
      weekday: "12:00 PM - 10:00 PM",
      weekend: "11:00 AM - 11:00 PM",
    },
    reviewScore: 4.7,
    contactEmail: "info@gourmetkitchen.com",
  },
});

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("Acceptant Test", () => {
  it("shows a list of restaurants", async () => {
    const restaurants = [
      { name: "Peru Fusion", description: "peru description 1" },
      { name: "Gourmet Kitchen", description: "gourmet description" },
      { name: "Burger Place", description: "burger description" },
    ];
    const mockRestaurants = restaurants.map(({ name, description }, index) =>
      createRestaurantData({ id: index.toString(), name, description })
    );

    // Given: A List of restaurant
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockRestaurants),
    });

    // When: The app is rendered
    renderComponent();

    // Then: The loader is displayed
    const loader = await screen.findByText(/Loading/);
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
  });
});

function renderComponent() {
  return render(<App />);
}
