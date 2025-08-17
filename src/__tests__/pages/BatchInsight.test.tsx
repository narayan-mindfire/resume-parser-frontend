import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import BatchInsightsPage from "../../pages/Insights";
import API from "../../services/axiosInterceptor";

vi.mock("../../services/axiosInterceptor", () => ({
  __esModule: true,
  default: { get: vi.fn() },
}));

describe("BatchInsightsPage", () => {
  it("renders loading state initially", () => {
    (API.get as any).mockResolvedValueOnce({ data: { insights: {} } });

    render(
      <MemoryRouter initialEntries={["/batches/123"]}>
        <Routes>
          <Route path="/batches/:batchId" element={<BatchInsightsPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText(/Loading insights/i)).toBeInTheDocument();
  });

  it("renders error state when API fails", async () => {
    (API.get as any).mockRejectedValueOnce(new Error("Network error"));

    render(
      <MemoryRouter initialEntries={["/batches/123"]}>
        <Routes>
          <Route path="/batches/:batchId" element={<BatchInsightsPage />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() =>
      expect(screen.getByText(/Failed to fetch insights/i)).toBeInTheDocument(),
    );
  });
});
