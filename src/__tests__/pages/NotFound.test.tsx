import { render, screen } from "@testing-library/react";
import { HelmetProvider } from "@dr.pogodin/react-helmet";
import NotFound from "../../pages/NotFound";
import { describe, expect, it } from "vitest";

describe("NotFound Page", () => {
  const renderWithHelmet = () =>
    render(
      <HelmetProvider>
        <NotFound />
      </HelmetProvider>,
    );

  it("renders the 404 heading", () => {
    renderWithHelmet();
    expect(
      screen.getByRole("heading", { name: /404 - Page Not Found/i }),
    ).toBeInTheDocument();
  });

  it("renders the description text", () => {
    renderWithHelmet();
    expect(
      screen.getByText(/Sorry, the page you’re looking for doesn’t exist/i),
    ).toBeInTheDocument();
  });

  it("sets the document title via Helmet", () => {
    renderWithHelmet();
    expect(document.title).toBe(
      "404 - Page Not Found | Recipe Sharing Platform",
    );
  });
});
