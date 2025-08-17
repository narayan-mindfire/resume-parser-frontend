import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProfilePage from "../../pages/Profile";
import API from "../../services/axiosInterceptor";
import { useAuth } from "../../hooks/useAuth";
// --- Mocks ---
vi.mock("../../services/axiosInterceptor", () => ({
  __esModule: true,
  default: { get: vi.fn(), delete: vi.fn() },
}));

vi.mock("../../hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

// Helmet can be mocked to avoid warnings
vi.mock("@dr.pogodin/react-helmet", () => ({
  Helmet: ({ children }: any) => <>{children}</>,
}));

describe("ProfilePage", () => {
  const mockLogout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as any).mockReturnValue({ logout: mockLogout });
  });

  it("renders loading state initially", async () => {
    (API.get as any).mockReturnValue(new Promise(() => {})); // never resolves

    render(
      <MemoryRouter initialEntries={["/profile"]}>
        <Routes>
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it("renders profile after successful fetch", async () => {
    (API.get as any).mockResolvedValueOnce({
      data: {
        fname: "John",
        lname: "Doe",
        email: "john@example.com",
        profileImage: "http://example.com/avatar.jpg",
        bio: "Hello world",
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-02-01T00:00:00Z",
      },
    });

    render(
      <MemoryRouter initialEntries={["/profile"]}>
        <Routes>
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() =>
      expect(screen.getByText("John Doe")).toBeInTheDocument(),
    );

    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText(/Hello world/i)).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /profile/i })).toHaveAttribute(
      "src",
      "http://example.com/avatar.jpg",
    );
  });

  it("shows confirm modal when Delete Account clicked", async () => {
    (API.get as any).mockResolvedValueOnce({
      data: {
        fname: "Jane",
        lname: "Smith",
        email: "jane@example.com",
        profileImage: "http://example.com/jane.jpg",
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-02-01T00:00:00Z",
      },
    });

    render(
      <MemoryRouter initialEntries={["/profile"]}>
        <Routes>
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() =>
      expect(screen.getByText("Jane Smith")).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByText(/Delete Account/i));

    await waitFor(() =>
      expect(
        screen.getByText(/Are you sure you want to delete your account/i),
      ).toBeInTheDocument(),
    );
  });

  it("calls API.delete and logout when confirming delete", async () => {
    (API.get as any).mockResolvedValueOnce({
      data: {
        fname: "Jane",
        lname: "Smith",
        email: "jane@example.com",
        profileImage: "http://example.com/jane.jpg",
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-02-01T00:00:00Z",
      },
    });
    (API.delete as any).mockResolvedValueOnce({});

    render(
      <MemoryRouter initialEntries={["/profile"]}>
        <Routes>
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() =>
      expect(screen.getByText("Jane Smith")).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByText(/Delete Account/i));

    await waitFor(() =>
      expect(
        screen.getByText(/Are you sure you want to delete your account/i),
      ).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByText("Yes, Delete"));

    await waitFor(() => {
      expect(API.delete).toHaveBeenCalledWith("/auth/me");
      expect(mockLogout).toHaveBeenCalled();
    });
  });
});
