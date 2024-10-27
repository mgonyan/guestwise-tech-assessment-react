import { render, screen, waitFor } from "@testing-library/react";
import RestaurantList from "../RestaurantList";
import { createRestaurantData } from "../../testUtils";
import userEvent from "@testing-library/user-event";

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("<RestaurantList />", () => {
  it("handles error from server", async () => {
    // Given: A server error
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockRejectedValueOnce(new Error("Server error")),
    });

    // When: Render a component
    renderComponent();

    // Then: The component renders an error message
    await waitFor(() => {
      expect(
        screen.getByText(/Error fetching restaurants: Server error/)
      ).toBeInTheDocument();
    });
  });
  describe("sorting", () => {
    it.each([
      {
        sortOption: "name-asc",
        sortedRestaurants: [
          { name: "Velvet & Vine", score: 1.3 },
          { name: "Sun set", score: 4.5 },
        ],
        expectedOrder: ["Sun set", "Velvet & Vine"],
      },
      {
        sortOption: "name-desc",
        sortedRestaurants: [
          { name: "Velvet & Vine", score: 1.3 },
          { name: "Sun set", score: 4.5 },
        ],
        expectedOrder: ["Velvet & Vine", "Sun set"],
      },
      {
        sortOption: "max-rating",
        sortedRestaurants: [
          { name: "Velvet & Vine", score: 1.3 },
          { name: "Max rating rest", score: 4.5 },
        ],
        expectedOrder: ["Max rating rest", "Velvet & Vine"],
      },
      {
        sortOption: "min-rating",
        sortedRestaurants: [
          { name: "Min rating rest", score: 1.3 },
          { name: "Sun set", score: 4.5 },
        ],
        expectedOrder: ["Min rating rest", "Sun set"],
      },
    ])(
      "sorts the restaurant list by '$sortOption'",
      async ({ sortOption, sortedRestaurants, expectedOrder }) => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          json: jest
            .fn()
            .mockResolvedValueOnce(
              sortedRestaurants.map((props, index) =>
                createRestaurantData({ ...props, id: index.toString() })
              )
            ),
        });

        render(<RestaurantList onRestaurantSelect={() => {}} />);

        const restaurants = await screen.findByRole("list", {
          name: /restaurants/i,
        });
        expect(restaurants).toBeInTheDocument();

        const sortByInput = screen.getByRole("combobox", {
          name: /sort by/i,
        });

        await userEvent.selectOptions(sortByInput, [sortOption]);

        const restaurantNames = await screen.findAllByRole("heading", {
          level: 5,
        });
        expect(
          restaurantNames.map((restaurant) => restaurant.textContent)
        ).toEqual(expectedOrder);
      }
    );
  });
});

function renderComponent() {
  return render(<RestaurantList onRestaurantSelect={jest.fn()} />);
}
