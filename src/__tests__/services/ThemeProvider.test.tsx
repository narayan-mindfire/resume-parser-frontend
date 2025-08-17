// ThemeProvider.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "../../context/ThemeProvider";
import { beforeEach, describe, expect, it } from "vitest";
import { ThemeContext } from "../../context/ThemeProvider";

describe("ThemeProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = "";
  });

  it("initializes with light theme if no localStorage value", () => {
    render(
      <ThemeProvider>
        <ThemeContext.Consumer>
          {(value) => (
            <span>{value?.darkMode ? "Dark mode" : "Light mode"}</span>
          )}
        </ThemeContext.Consumer>
      </ThemeProvider>,
    );

    expect(screen.getByText("Light mode")).toBeInTheDocument();
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(localStorage.getItem("theme")).toBe("light");
  });

  it("initializes with dark theme if localStorage is set", () => {
    localStorage.setItem("theme", "dark");

    render(
      <ThemeProvider>
        <ThemeContext.Consumer>
          {(value) => (
            <span>{value?.darkMode ? "Dark mode" : "Light mode"}</span>
          )}
        </ThemeContext.Consumer>
      </ThemeProvider>,
    );

    expect(screen.getByText("Dark mode")).toBeInTheDocument();
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(localStorage.getItem("theme")).toBe("dark");
  });

  it("toggles between light and dark mode", () => {
    render(
      <ThemeProvider>
        <ThemeContext.Consumer>
          {(value) => <button onClick={value?.toggleTheme}>Toggle</button>}
        </ThemeContext.Consumer>
      </ThemeProvider>,
    );

    const button = screen.getByRole("button", { name: "Toggle" });

    // Initial state
    expect(document.documentElement.classList.contains("dark")).toBe(false);

    // Toggle to dark
    fireEvent.click(button);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(localStorage.getItem("theme")).toBe("dark");

    // Toggle back to light
    fireEvent.click(button);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(localStorage.getItem("theme")).toBe("light");
  });
});
