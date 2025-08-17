import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import SidebarLayout from "../../components/generic/SideBar";

const mockLogout = vi.fn();

vi.mock("../../hooks/useAuth", () => ({
  useAuth: () => ({
    logout: mockLogout,
  }),
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom",
    );
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("SidebarLayout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <SidebarLayout />
      </BrowserRouter>,
    );

  it("renders navigation links", () => {
    renderComponent();
    expect(screen.getByText(/Upload Resumes/i)).toBeInTheDocument();
    expect(screen.getByText(/Your Uploads/i)).toBeInTheDocument();
    expect(screen.getByText(/Logout/i)).toBeInTheDocument();
  });

  it("calls logout and navigates when logout is clicked", () => {
    renderComponent();
    const logoutButton = screen.getByText(/Logout/i);
    fireEvent.click(logoutButton);
    expect(mockLogout).toHaveBeenCalled();

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
