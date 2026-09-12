import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders the three personal links", () => {
  render(<App />);
  expect(screen.getByRole("link", { name: /linkedin/i })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /github/i })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /blog/i })).toHaveAttribute(
    "href",
    "/blog",
  );
});
