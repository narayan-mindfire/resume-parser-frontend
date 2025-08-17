import { renderHook, act } from "@testing-library/react";
import { useTheme } from "../../hooks/useTheme";
import { ThemeContext } from "../../context/ThemeProvider";
import { describe, expect, it, vi } from "vitest";

describe("useTheme hook", () => {
  it("returns context values when used inside ThemeProvider", () => {
    const toggleTheme = vi.fn();
    const contextValue = { darkMode: true, toggleTheme };

    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => (
        <ThemeContext.Provider value={contextValue}>
          {children}
        </ThemeContext.Provider>
      ),
    });

    expect(result.current.darkMode).toBe(true);
    expect(result.current.toggleTheme).toBe(toggleTheme);

    act(() => {
      result.current.toggleTheme();
    });

    expect(toggleTheme).toHaveBeenCalled();
  });
});
