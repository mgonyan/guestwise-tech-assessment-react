import { render, screen, waitFor } from "@testing-library/react";
import RestaurantDetails from "../RestaurantDetails";

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("<RestaurantDetails />", () => {
  it("renders empty if not restaurantId is invalid", () => {
    renderComponent({ restaurantId: 0 });

    expect(screen.queryByText(/Restaurant Details/)).toBeNull();
  });
  it("handles error from server", async () => {
    // Given: A server error
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockRejectedValueOnce(new Error("Server error")),
    });

    // When: Render a component
    renderComponent({ restaurantId: 1 });

    // Then: The component renders an error message
    await waitFor(() => {
      expect(
        screen.getByText(/Error fetching restaurant details: Server error/)
      ).toBeInTheDocument();
    });
  });
});

function renderComponent({ restaurantId }: { restaurantId: number }) {
  return render(<RestaurantDetails restaurantId={restaurantId} />);
}
