import { describe, it, expect } from "vitest";
import { formatDate } from "../../utils/formatDate";

describe("formatDate", () => {
  it("formats a standard date string correctly", () => {
    const dateString = "2023-01-01T12:00:00Z";
    const formattedDate = formatDate(dateString);
    expect(formattedDate).toBe("Jan 1, 2023, 05:30 PM");
  });

  it("formats a date string in the afternoon correctly", () => {
    const dateString = "2024-07-15T15:30:00Z";
    const formattedDate = formatDate(dateString);
    expect(formattedDate).toBe("Jul 15, 2024, 09:00 PM");
  });

  it("formats a date string at midnight (AM)", () => {
    const dateString = "2024-07-15T00:00:00Z";
    const formattedDate = formatDate(dateString);
    expect(formattedDate).toBe("Jul 15, 2024, 05:30 AM");
  });

  it("formats a date string at noon (PM)", () => {
    const dateString = "2024-07-15T12:00:00Z";
    const formattedDate = formatDate(dateString);
    expect(formattedDate).toBe("Jul 15, 2024, 05:30 PM");
  });
});
