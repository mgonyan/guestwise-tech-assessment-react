import React from "react";
import { render, screen } from "@testing-library/react";
import App from "../App";

test("renders restaurant list with dynamic restaurant name and description", () => {
  render(<App />);

  const restaurantName = screen.getByRole("heading", {
    level: 5,
    name: /Velvet & Vine/i,
  });
  const restaurantDescription = screen.getByText(
    /A fine dining experience with a modern twist./i
  );

  expect(restaurantName).toBeInTheDocument();
  expect(restaurantDescription).toBeInTheDocument();
});
