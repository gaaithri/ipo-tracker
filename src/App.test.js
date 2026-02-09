import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders IPO List navigation link", () => {
  render(<App />);
  const linkElement = screen.getByText(/IPO List/i);
  expect(linkElement).toBeInTheDocument();
});
