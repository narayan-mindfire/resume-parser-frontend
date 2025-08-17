import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { HeroSection } from "../../components/utils/HeroSection";
import { useAuth } from "../../hooks/useAuth";

vi.mock("framer-motion", () => ({
  motion: {
    section: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
  },
}));

vi.mock("../../hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../../components/utils/Button", () => ({
  __esModule: true,
  default: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

describe("HeroSection", () => {
  it("renders a link to '/login' when no user is logged in", () => {
    (useAuth as any).mockReturnValue({ currentUser: null });
    render(
      <MemoryRouter>
        <HeroSection />
      </MemoryRouter>,
    );
    const uploadButton = screen.getByRole("link", {
      name: /Upload Resumes/i,
    });
    expect(uploadButton).toHaveAttribute("href", "/login");
  });

  it("renders a link to '/upload' when a user is logged in", () => {
    (useAuth as any).mockReturnValue({ currentUser: {} });
    render(
      <MemoryRouter>
        <HeroSection />
      </MemoryRouter>,
    );
    const uploadButton = screen.getByRole("link", {
      name: /Upload Resumes/i,
    });
    expect(uploadButton).toHaveAttribute("href", "/upload");
  });
});
