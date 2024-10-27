import { render, screen, waitFor } from "@testing-library/react";
import RestaurantList from "../components/RestaurantList";

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
});

function renderComponent() {
  return render(<RestaurantList onRestaurantSelect={jest.fn()} />);
}
