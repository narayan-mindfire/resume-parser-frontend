import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ProtectedRoute } from "../../routeProtection/ProtectedRoute";
// mock useAuth
vi.mock("../../hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from "../../hooks/useAuth";

// Utility for rendering with router
function renderWithRouter(ui: React.ReactNode, initialEntries = ["/"]) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="*" element={ui} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("ProtectedRoute", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders children when user is authenticated", () => {
    (useAuth as any).mockReturnValue({ currentUser: { id: "123" } });

    renderWithRouter(
      <ProtectedRoute>
        <div>Private Content</div>
      </ProtectedRoute>,
    );

    expect(screen.getByText("Private Content")).toBeInTheDocument();
  });

  it("redirects to '/' when unauthenticated and not on /me", () => {
    (useAuth as any).mockReturnValue({ currentUser: null });

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div>Dashboard</div>
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

  it("redirects to '/' when unauthenticated and accessing /me", () => {
    (useAuth as any).mockReturnValue({ currentUser: null });

    render(
      <MemoryRouter initialEntries={["/me"]}>
        <Routes>
          <Route
            path="/me"
            element={
              <ProtectedRoute>
                <div>Profile Page</div>
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });
});
