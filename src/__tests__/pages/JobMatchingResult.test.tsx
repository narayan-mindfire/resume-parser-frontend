// src/pages/__tests__/JobMatchingResultPage.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import JobMatchingResultPage from "../../pages/JobMatchingResult";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import API from "../../services/axiosInterceptor";
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock API module
vi.mock("../../services/axiosInterceptor");

describe("JobMatchingResultPage", () => {
  const mockMatches = [
    {
      resumeId: "r1",
      score: {
        total: 90,
        breakdown: { skills: 30, experience: 30, keywords: 30 },
      },
    },
  ];

  const mockResumes = [
    { id: "r1", name: "John Doe", url: "http://example.com/resume.pdf" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading initially", () => {
    render(
      <MemoryRouter initialEntries={["/jobs/match/1/job/1"]}>
        <Routes>
          <Route
            path="/jobs/match/:batchId/job/:jobId"
            element={<JobMatchingResultPage />}
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Loading job matches...")).toBeInTheDocument();
  });

  it("renders match results after API fetch", async () => {
    (API.get as any)
      .mockResolvedValueOnce({ data: { matches: mockMatches } }) // match API
      .mockResolvedValueOnce({ data: { resumes: mockResumes } }); // resumes API

    render(
      <MemoryRouter initialEntries={["/jobs/match/1/job/1"]}>
        <Routes>
          <Route
            path="/jobs/match/:batchId/job/:jobId"
            element={<JobMatchingResultPage />}
          />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Total Score:")).toBeInTheDocument();
      expect(screen.getByText("Skills: 30")).toBeInTheDocument();
      expect(screen.getByText("Experience: 30")).toBeInTheDocument();
      expect(screen.getByText("Keywords: 30")).toBeInTheDocument();
    });
  });
});
