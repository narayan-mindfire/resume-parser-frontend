// ConfirmModal.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import ConfirmModal from "../../components/modals/ConfirmModal";
import { describe, it, expect, vi } from "vitest";

describe("ConfirmModal", () => {
  it("renders the message", () => {
    render(
      <ConfirmModal
        message="Are you sure?"
        onConfirm={() => {}}
        onCancel={() => {}}
      />,
    );

    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
  });

  it("calls onCancel when Cancel is clicked", () => {
    const onCancel = vi.fn();
    render(
      <ConfirmModal
        message="Delete this item?"
        onConfirm={() => {}}
        onCancel={onCancel}
      />,
    );

    fireEvent.click(screen.getByText("Cancel"));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("calls onConfirm when Yes, Delete is clicked", () => {
    const onConfirm = vi.fn();
    render(
      <ConfirmModal
        message="Delete this item?"
        onConfirm={onConfirm}
        onCancel={() => {}}
      />,
    );

    fireEvent.click(screen.getByText("Yes, Delete"));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
