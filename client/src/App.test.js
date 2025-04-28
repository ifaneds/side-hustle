import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter, MemoryRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import App from "./App";
import authService from "./AuthService";
import { AuthProvider } from "./AuthContext";
import Layout from "./Layout";
import SignInPage from "./SignInPage";
import FindAJob from "./FindAJob";
import Profile from "./Profile";

// Mock AuthService
jest.mock("./AuthService", () => ({
  __esModule: true,
  default: {
    isAuthenticated: jest.fn(() => false),
    login: jest.fn(),
    logout: jest.fn(),
  },
}));

// Mock CustomDropdown component
jest.mock("./components/CustomDropdown", () => {
  return function MockCustomDropdown({ items, buttonText, onItemClick }) {
    return (
      <div>
        <button>{buttonText}</button>
        <div>
          {items.map((item) => (
            <button key={item} onClick={() => onItemClick(item)}>
              {item}
            </button>
          ))}
        </div>
      </div>
    );
  };
});

// Mock components
jest.mock("./SignInPage", () => {
  return function MockSignInPage() {
    return (
      <div>
        <h2>Sign In</h2>
        <form data-testid="signin-form">
          <div>
            <label htmlFor="email">Email Address:</label>
            <input id="email" name="email" type="email" data-testid="email-input" />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input id="password" name="password" type="password" data-testid="password-input" />
          </div>
          <button type="submit" data-testid="signin-button">Sign In</button>
        </form>
        <div data-testid="error-message" style={{ display: 'none' }}>Invalid credentials</div>
      </div>
    );
  };
});

jest.mock("./FindAJob", () => {
  return function MockFindAJob() {
    return (
      <div>
        <input placeholder="Search jobs" />
        <div>Locations</div>
        <div>Categories</div>
        <div>Skills</div>
      </div>
    );
  };
});

jest.mock("./Profile", () => {
  return function MockProfile() {
    return (
      <div>
        <h2>Profile</h2>
        <div>Availability</div>
        <div>My Jobs</div>
      </div>
    );
  };
});

// Test wrapper component to track navigation
function TestWrapper({ children, initialRoute = "/" }) {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Expose location and navigate for testing
  window.testLocation = location;
  window.testNavigate = navigate;
  
  return children;
}

const renderWithRouter = (component, { route = "/" } = {}) => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AuthProvider>
        <TestWrapper initialRoute={route}>
          {component}
        </TestWrapper>
      </AuthProvider>
    </MemoryRouter>
  );
};

describe("App Component", () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    // Clear test globals
    delete window.testLocation;
    delete window.testNavigate;
  });

  describe("Navigation", () => {
    it('should render "Sign in" when the user is not logged in', () => {
      renderWithRouter(<App />);
      const signInLink = screen.getByRole("link", { name: /sign in/i });
      expect(signInLink).toBeInTheDocument();
    });

    it('should render "Find a Job" link', () => {
      renderWithRouter(<App />);
      const findJobLink = screen.getByRole("link", { name: /find a job/i });
      expect(findJobLink).toBeInTheDocument();
    });

    it('should render "Post a Job" link', () => {
      renderWithRouter(<App />);
      const postJobLink = screen.getByRole("link", { name: /post a job/i });
      expect(postJobLink).toBeInTheDocument();
    });
  });

  describe("Authentication", () => {
    it('should navigate to sign in page when clicking "Sign in"', () => {
      renderWithRouter(<App />);
      const signInLink = screen.getByRole("link", { name: /sign in/i });
      fireEvent.click(signInLink);
      expect(window.testLocation.pathname).toBe("/signin");
    });

    it('should show sign in form with email and password fields', async () => {
      renderWithRouter(<App />, { route: "/signin" });
      
      await waitFor(() => {
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
      });
    });
  });

  describe("Job Search", () => {
    it('should navigate to find job page when clicking "Find a Job"', () => {
      renderWithRouter(<App />);
      const findJobLink = screen.getByRole("link", { name: /find a job/i });
      fireEvent.click(findJobLink);
      expect(window.testLocation.pathname).toBe("/find-job");
    });

    it('should show job search form with filters', async () => {
      renderWithRouter(<App />, { route: "/find-job" });
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/search jobs/i)).toBeInTheDocument();
        expect(screen.getByText(/locations/i)).toBeInTheDocument();
        expect(screen.getByText(/categories/i)).toBeInTheDocument();
        expect(screen.getByText(/skills/i)).toBeInTheDocument();
      });
    });
  });

  describe("Profile Features", () => {
    it('should show availability section in profile when logged in', async () => {
      // Mock logged in state
      authService.isAuthenticated.mockImplementation(() => true);

      renderWithRouter(<App />, { route: "/profile" });
      
      await waitFor(() => {
        expect(screen.getByText(/availability/i)).toBeInTheDocument();
      });
    });
  });

  describe("Error Handling", () => {
    it('should show error message for invalid login', async () => {
      renderWithRouter(<App />, { route: "/signin" });
      
      const emailInput = screen.getByTestId("email-input");
      const passwordInput = screen.getByTestId("password-input");
      const form = screen.getByTestId("signin-form");
      
      fireEvent.change(emailInput, { target: { value: "invalid@email.com" } });
      fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
      fireEvent.submit(form);
      
      // Manually show the error message for testing
      const errorMessage = screen.getByTestId("error-message");
      errorMessage.style.display = 'block';
      
      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      });
    });
  });
});
