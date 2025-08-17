import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import BatchUploads from "../../pages/BatchUploads";
import API from "../../services/axiosInterceptor";
import type { Resume } from "../../types/types";

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    useParams: vi.fn(),
    useLocation: vi.fn(() => ({
      state: { batchDate: "Jan 1, 2024, 10:00 AM" },
    })),
  };
});

vi.mock("../../services/axiosInterceptor", () => ({
  default: {
    get: vi.fn(),
  },
}));

vi.mock("../../components/utils/ResumeCard", () => ({
  __esModule: true,
  default: ({ name }: { name: string }) => (
    <div data-testid="resume-card">{name}</div>
  ),
}));

vi.mock("../../components/utils/Button", () => ({
  __esModule: true,
  default: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

const mockResumes: Resume[] = [
  {
    id: "1",
    name: "John Doe",
    fileName: "resume.pdf",
    url: "",
    processingStatus: "completed",
    email: "john@example.com",
    phone: "",
    totalExperienceYears: 5,
    skills: [],
    experience: [],
    education: [],
  },
  {
    id: "2",
    name: "Jane Smith",
    fileName: "resume2.pdf",
    url: "",
    processingStatus: "completed",
    email: "jane@example.com",
    phone: "",
    totalExperienceYears: 3,
    skills: [],
    experience: [],
    education: [],
  },
];

import { useParams } from "react-router-dom";

describe("BatchUploads", () => {
  beforeEach(() => {
    vi.mocked(useParams).mockReturnValue({
      batchId: "123",
    });
  });

  it("renders loading state initially", () => {
    vi.spyOn(API, "get").mockReturnValue(new Promise(() => {}));
    render(
      <MemoryRouter>
        <BatchUploads />
      </MemoryRouter>,
    );
    expect(screen.getByText("Loading resumes...")).toBeInTheDocument();
  });

  it("renders error state when fetch fails", async () => {
    vi.spyOn(API, "get").mockRejectedValue(new Error("API Error"));
    render(
      <MemoryRouter>
        <BatchUploads />
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(screen.queryByText("Loading resumes...")).not.toBeInTheDocument();
    });
  });

  it("renders 'No resumes found' message when batch is empty", async () => {
    vi.spyOn(API, "get").mockResolvedValue({ data: { resumes: [] } });
    render(
      <MemoryRouter>
        <BatchUploads />
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(
        screen.getByText("No resumes found for this batch."),
      ).toBeInTheDocument();
    });
  });

  it("renders a list of resumes when fetch is successful", async () => {
    vi.spyOn(API, "get").mockResolvedValue({
      data: { resumes: mockResumes },
    });
    render(
      <MemoryRouter>
        <BatchUploads />
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
      expect(screen.getAllByTestId("resume-card")).toHaveLength(2);
    });
  });
});
