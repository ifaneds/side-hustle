import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

describe("App Component", () => {
  it('should render "Sign in" when the user is not logged in', () => {
    render(<App />);
    const signInLink = screen.getByRole("link", { name: "Sign in" });
    expect(signInLink).toBeInTheDocument();
  });

  it('should render "Profile" when the user is logged in', () => {
    render(<App />);
    const signInLink = screen.getByRole("link", { name: "Sign in" });
    fireEvent.click(signInLink);
    const profileLink = screen.getByRole("link", { name: "Profile" });
    expect(profileLink).toBeInTheDocument();
  });
});
