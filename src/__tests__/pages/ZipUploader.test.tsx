// src/pages/ZipUploader.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ZipUploader from "../../pages/ZipUploader";
import { BrowserRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import { vi } from "vitest";

// Mock axiosInterceptor
vi.mock("../services/axiosInterceptor", () => ({
  default: {
    post: vi.fn().mockResolvedValue({ data: { batchId: "batch123" } }),
  },
}));

// Mock socket.io-client
const mockOn = vi.fn();
const mockEmit = vi.fn();
const mockDisconnect = vi.fn();

vi.mock("socket.io-client", () => ({
  io: vi.fn(() => ({
    on: mockOn,
    emit: mockEmit,
    disconnect: mockDisconnect,
  })),
}));

const renderWithRouter = () =>
  render(
    <BrowserRouter>
      <ZipUploader />
    </BrowserRouter>,
  );

describe("ZipUploader", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders upload area and idle status", () => {
    renderWithRouter();
    expect(screen.getByText(/Upload ZIP \(Drag & Drop\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Status: Idle/i)).toBeInTheDocument();
  });

  it("changes border color on drag over and back on drag leave", () => {
    renderWithRouter();
    const dropZone = screen.getByText(/Drag & drop your .zip/i).parentElement!;
    fireEvent.dragOver(dropZone);
    expect(dropZone.className).toMatch(/border-\[var\(--accent\)\]/);
    fireEvent.dragLeave(dropZone);
    expect(dropZone.className).toMatch(/border-\[var\(--muted\)\]/);
  });

  it("handles file select and updates status", async () => {
    renderWithRouter();

    const file = new File(["dummy content"], "test.zip", {
      type: "application/zip",
    });

    const input = screen.getByTestId("file-input") as HTMLInputElement;
    // Note: since <input type="file" className="hidden" /> we add data-testid to target it in the component for easier testing

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() =>
      expect(screen.getByText(/Uploading/i)).toBeInTheDocument(),
    );
  });

  it("shows file status when processing", async () => {
    renderWithRouter();

    const file = new File(["dummy content"], "sample.zip", {
      type: "application/zip",
    });

    const input = screen.getByTestId("file-input") as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() =>
      expect(
        screen.getByText(/Waiting for server to process/i),
      ).toBeInTheDocument(),
    );
  });
});
