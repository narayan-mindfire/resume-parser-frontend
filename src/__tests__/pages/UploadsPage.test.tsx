import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import UploadsPage from "../../pages/UploadsPage";
import API from "../../services/axiosInterceptor";

vi.mock("../../services/axiosInterceptor");

describe("UploadsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders loading state initially", async () => {
    (API.get as any).mockReturnValue(new Promise(() => {}));

    render(<UploadsPage />);

    expect(screen.getByText(/Loading batches/i)).toBeInTheDocument();
  });

  it("renders error state when API fails", async () => {
    (API.get as any).mockRejectedValueOnce(new Error("Network error"));

    render(<UploadsPage />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch batches/i)).toBeInTheDocument();
    });
  });

  it("renders empty state when no batches are returned", async () => {
    (API.get as any).mockResolvedValueOnce({ data: [] });

    render(<UploadsPage />);

    await waitFor(() => {
      expect(screen.getByText(/No batches found/i)).toBeInTheDocument();
      expect(
        screen.getByText(/You haven't uploaded any resumes yet/i),
      ).toBeInTheDocument();
    });
  });
});
