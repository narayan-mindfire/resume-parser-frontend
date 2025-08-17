// src/__tests__/services/exportCSV.test.tsx
import { exportResumesToCSV } from "../../services/exportCSV";
import type { Resume } from "../../types/types";
import { describe, it, expect, vi } from "vitest";

describe("exportResumesToCSV", () => {
  const mockResumes: Resume[] = [
    {
      id: "1",
      fileName: "resume1.pdf",
      name: "John Doe",
      email: "john@example.com",
      phone: "1234567890",
      totalExperienceYears: 5,
      processingStatus: "completed",
      skills: ["React", "Node.js"],
      experience: ["Company A", "Company B"],
      education: ["B.Tech CS"],
      url: "http://example.com/resume1.pdf",
    },
  ];

  it("creates a download link and triggers click", () => {
    // Mock URL.createObjectURL
    const mockCreateObjectURL = vi.fn(() => "blob:http://mock-url");
    vi.stubGlobal("URL", { createObjectURL: mockCreateObjectURL } as any);

    // Use a real anchor element
    const link = document.createElement("a");
    const clickSpy = vi.spyOn(link, "click");

    // Spy on createElement to return our real anchor
    const createElementSpy = vi
      .spyOn(document, "createElement")
      .mockReturnValue(link);

    exportResumesToCSV(mockResumes, "batch123");

    expect(createElementSpy).toHaveBeenCalledWith("a");
    expect(link.getAttribute("download")).toBe(`resumes_batch_batch123.csv`);
    expect(clickSpy).toHaveBeenCalled();
    expect(mockCreateObjectURL).toHaveBeenCalled();

    createElementSpy.mockRestore();
    clickSpy.mockRestore();
  });
});
