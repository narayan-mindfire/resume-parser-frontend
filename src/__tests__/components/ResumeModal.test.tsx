import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import ResumeModal from "../../components/modals/ResumeModal";
import type { Resume } from "../../types/types";

vi.mock("react-router", () => ({
  ...vi.importActual("react-router"),
  Link: vi.fn(({ to, children, ...props }) => (
    <a href={to} {...props}>
      {children}
    </a>
  )),
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
  skills: ["JavaScript", "React", "Node.js"],
  experience: ["Software Engineer at Tech Corp"],
  education: ["Bachelor of Science in Computer Science"],
};

describe("ResumeModal", () => {
  const mockOnClose = vi.fn();

  it("calls onClose when the close button is clicked", () => {
    render(
      <MemoryRouter>
        <ResumeModal resume={mockResume} onClose={mockOnClose} />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByLabelText("Close modal"));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("resets document.body overflow on unmount", () => {
    document.body.style.overflow = "auto";
    const { unmount } = render(
      <MemoryRouter>
        <ResumeModal resume={mockResume} onClose={mockOnClose} />
      </MemoryRouter>,
    );
    expect(document.body.style.overflow).toBe("hidden");

    act(() => {
      unmount();
    });

    expect(document.body.style.overflow).toBe("unset");
  });

  it("does not render skills section if skills array is empty", () => {
    const resumeWithoutSkills = { ...mockResume, skills: [] };
    render(
      <MemoryRouter>
        <ResumeModal resume={resumeWithoutSkills} onClose={mockOnClose} />
      </MemoryRouter>,
    );
    expect(screen.queryByText("Skills")).not.toBeInTheDocument();
  });

  it("does not render experience section if experience array is empty", () => {
    const resumeWithoutExperience = { ...mockResume, experience: [] };
    render(
      <MemoryRouter>
        <ResumeModal resume={resumeWithoutExperience} onClose={mockOnClose} />
      </MemoryRouter>,
    );
    expect(screen.queryByText("Experience")).not.toBeInTheDocument();
  });

  it("does not render education section if education array is empty", () => {
    const resumeWithoutEducation = { ...mockResume, education: [] };
    render(
      <MemoryRouter>
        <ResumeModal resume={resumeWithoutEducation} onClose={mockOnClose} />
      </MemoryRouter>,
    );
    expect(screen.queryByText("Education")).not.toBeInTheDocument();
  });
});
