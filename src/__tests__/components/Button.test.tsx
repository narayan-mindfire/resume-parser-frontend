import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Button from "../../components/utils/Button";
import { MemoryRouter } from "react-router-dom";

describe("Button", () => {
  it("renders with default variant", () => {
    render(<Button>Click Me</Button>);
    const button = screen.getByRole("button", { name: /Click Me/i });
    expect(button).toHaveClass("bg-[var(--accent)]");
    expect(button).toHaveClass("text-white");
  });

  it("renders with outline variant", () => {
    render(<Button variant="outline">Click Me</Button>);
    const button = screen.getByRole("button", { name: /Click Me/i });
    expect(button).toHaveClass("border");
    expect(button).toHaveClass("border-[var(--text)]");
  });

  it("renders with danger variant", () => {
    render(<Button variant="danger">Delete</Button>);
    const button = screen.getByRole("button", { name: /Delete/i });
    expect(button).toHaveClass("border");
    expect(button).toHaveClass("border-[var(--text)]");
  });

  it("renders a disabled button", () => {
    render(<Button disabled>Click Me</Button>);
    const button = screen.getByRole("button", { name: /Click Me/i });
    expect(button).toBeDisabled();
  });

  it("renders as a link when 'to' prop is provided", () => {
    render(
      <MemoryRouter>
        <Button to="/test-route">Go to Test</Button>
      </MemoryRouter>,
    );
    const link = screen.getByRole("link", { name: /Go to Test/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/test-route");
  });

  it("applies a custom className", () => {
    const customClass = "custom-tailwind-class";
    render(<Button className={customClass}>Styled</Button>);
    const button = screen.getByRole("button", { name: /Styled/i });
    expect(button).toHaveClass(customClass);
  });
});
