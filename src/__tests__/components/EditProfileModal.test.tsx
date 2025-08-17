// src/components/modals/EditProfileModal.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EditProfileModal from "../../components/modals/EditProfileModal";
import { describe, expect, it } from "vitest";
import { vi } from "vitest";

// Mock axiosInterceptor
vi.mock("../../services/axiosInterceptor", () => ({
  default: {
    put: vi.fn().mockResolvedValue({}),
  },
}));

import API from "../../services/axiosInterceptor";

describe("EditProfileModal", () => {
  const defaultValues = {
    fname: "John",
    lname: "Doe",
    email: "john@example.com",
    bio: "Hello world",
    profileImage: undefined,
  };

  const setup = (props = {}) => {
    const onClose = vi.fn();
    const onSuccess = vi.fn();

    render(
      <EditProfileModal
        defaultValues={defaultValues}
        onClose={onClose}
        onSuccess={onSuccess}
        {...props}
      />,
    );
    return { onClose, onSuccess };
  };

  it("renders modal with form fields", () => {
    setup();
    expect(screen.getByText(/Edit Profile/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("First Name")).toHaveValue("John");
    expect(screen.getByPlaceholderText("Last Name")).toHaveValue("Doe");
    expect(screen.getByPlaceholderText("Email")).toHaveValue(
      "john@example.com",
    );
    expect(screen.getByPlaceholderText("Bio")).toHaveValue("Hello world");
  });

  it("calls onClose when ✕ button is clicked", () => {
    const { onClose } = setup();
    fireEvent.click(screen.getByText("✕"));
    expect(onClose).toHaveBeenCalled();
  });

  it("submits form successfully and calls onSuccess + onClose", async () => {
    const { onClose, onSuccess } = setup();

    fireEvent.change(screen.getByPlaceholderText("First Name"), {
      target: { value: "Jane" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Save Changes/i }));

    await waitFor(() => {
      expect(API.put).toHaveBeenCalledWith(
        "/auth/me",
        expect.any(FormData),
        expect.any(Object),
      );
      expect(onSuccess).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });
  });

  it("shows validation errors when fields are empty", async () => {
    setup();

    fireEvent.change(screen.getByPlaceholderText("First Name"), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByPlaceholderText("Last Name"), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Save Changes/i }));

    await waitFor(() => {
      expect(screen.getByText(/First name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Last name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Invalid email address/i)).toBeInTheDocument();
    });
  });
});
