import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import JobMatchingPage from "../../pages/JobMatching";
import { JOBS } from "../../constants/jobDescriptions";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("JobMatchingPage", () => {
  it("renders 'No batch selected' when no batchId in params", () => {
    render(
      <MemoryRouter initialEntries={["/jobs"]}>
        <Routes>
          <Route path="/jobs" element={<JobMatchingPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText(/No batch selected/i)).toBeInTheDocument();
  });

  it("renders all jobs when batchId is present", () => {
    render(
      <MemoryRouter initialEntries={["/jobs/123"]}>
        <Routes>
          <Route path="/jobs/:batchId" element={<JobMatchingPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(
      screen.getByText(/Select a Job to Match with Batch/i),
    ).toBeInTheDocument();

    expect(screen.getByText(JOBS[0].title)).toBeInTheDocument();
    expect(screen.getByText(JOBS[0].description)).toBeInTheDocument();

    expect(
      screen.getByText(
        new RegExp(`${JOBS[0].required_experience_years} years`, "i"),
      ),
    ).toBeInTheDocument();
  });

  it("navigates to job match when clicking 'Match This Job'", () => {
    render(
      <MemoryRouter initialEntries={["/jobs/123"]}>
        <Routes>
          <Route path="/jobs/:batchId" element={<JobMatchingPage />} />
        </Routes>
      </MemoryRouter>,
    );

    const button = screen.getAllByText(/Match This Job/i)[0];
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith(`/match/123/job/${JOBS[0].id}`);
  });
});
