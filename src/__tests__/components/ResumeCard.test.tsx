import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import ResumeCard from "../../components/utils/ResumeCard";
import type { Resume } from "../../types/types";

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    Link: vi.fn(({ to, children, ...props }) => (
      <a href={to} {...props}>
        {children}
      </a>
    )),
  };
});

vi.mock("../../components/modals/ResumeModal", () => ({
  __esModule: true,
  default: vi.fn(() => null),
}));

vi.mock("../../components/utils/Button", () => ({
  __esModule: true,
  default: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
}));

const mockResume: Resume = {
  id: "1",
  name: "John Doe",
  fileName: "resume.pdf",
  url: "http://example.com/resume.pdf",
  processingStatus: "completed",
  email: "john@example.com",
  phone: "123-456-7890",
  totalExperienceYears: 5,
  skills: [],
  experience: [],
  education: [],
};

const mockIncompleteResume: Resume = {
  id: "2",
  name: "Jane Smith",
  fileName: "resume2.pdf",
  url: "http://example.com/resume2.pdf",
  processingStatus: "processing",
  email: null,
  phone: null,
  totalExperienceYears: 0,
  skills: [],
  experience: [],
  education: [],
};

describe("ResumeCard", () => {
  it("renders a completed resume correctly with all details", () => {
    render(
      <MemoryRouter>
        <ResumeCard {...mockResume} />
      </MemoryRouter>,
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("resume.pdf")).toBeInTheDocument();
    expect(screen.getByText("completed")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("123-456-7890")).toBeInTheDocument();
    expect(screen.getByText("5 years")).toBeInTheDocument();
    expect(screen.getByText("completed")).toHaveClass("bg-[var(--accent)]");
  });

  it("renders an incomplete resume correctly with minimal details", () => {
    render(
      <MemoryRouter>
        <ResumeCard {...mockIncompleteResume} />
      </MemoryRouter>,
    );

    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("processing")).toBeInTheDocument();
    expect(screen.queryByText("john@example.com")).not.toBeInTheDocument();
    expect(screen.queryByText("123-456-7890")).not.toBeInTheDocument();
    expect(screen.getByText("0 years")).toBeInTheDocument();
    expect(screen.getByText("processing")).toHaveClass("bg-[var(--primary)]");
  });
});
