import { render, screen } from "@testing-library/react";
import Unauthenticated from "../../pages/Unauthenticated";
import { describe, expect, it } from "vitest";

describe("Unauthenticated", () => {
  it("renders heading and message", () => {
    render(<Unauthenticated />);

    expect(
      screen.getByRole("heading", { name: /unauthorized access/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/you must be logged in to view this page/i),
    ).toBeInTheDocument();
  });
});
