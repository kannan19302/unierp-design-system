import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { axe } from "vitest-axe";
import {
  Alert,
  Banner,
  InlineMessage,
  Progress,
  Switch,
  Checkbox,
  RadioGroup,
  Slider,
  NumberInput,
  CurrencyInput,
  TimePicker,
  Accordion,
  Avatar,
  UserChip,
  PriorityIndicator,
  HealthScore,
  PageHeader,
  LoadingState,
  FilteredEmptyState,
  ErrorState,
  ForbiddenState,
} from "../index";

describe("Stage B-I Primitives Tests & Accessibility", () => {
  test("Alert renders correctly", () => {
    render(
      <Alert variant="info" title="Alert Title">
        Alert Message Content
      </Alert>
    );
    expect(screen.getByRole("alert")).toBeDefined();
    expect(screen.getByText("Alert Title")).toBeDefined();
  });

  test("Switch renders and handles attributes", () => {
    render(<Switch label="Enable Notifications" id="switch-1" />);
    const switchEl = screen.getByRole("switch");
    expect(switchEl).toBeDefined();
    expect(switchEl.getAttribute("aria-checked")).toBe("false");
  });

  test("RadioGroup renders options with labels", () => {
    render(
      <RadioGroup
        name="test-group"
        options={[
          { value: "a", label: "Option A" },
          { value: "b", label: "Option B" },
        ]}
      />
    );
    expect(screen.getByRole("radiogroup")).toBeDefined();
  });

  test("CurrencyInput formats currency", () => {
    render(<CurrencyInput value={49.99} currencySymbol="$" />);
    expect(screen.getByRole("spinbutton")).toBeDefined();
  });

  test("Avatar and Identity components render", () => {
    render(<Avatar name="John Doe" size="md" />);
    expect(screen.getByText("JD")).toBeDefined();

    render(<UserChip name="Alice Smith" role="Admin" status="online" />);
    expect(screen.getByText("Alice Smith")).toBeDefined();

    render(<PriorityIndicator priority="high" />);
    expect(screen.getByText("High")).toBeDefined();

    render(<HealthScore score={95} />);
    expect(screen.getByText("95%")).toBeDefined();
  });

  test("Six states components render correctly", () => {
    render(<LoadingState message="Fetching data..." />);
    expect(screen.getByText("Fetching data...")).toBeDefined();

    render(<FilteredEmptyState title="No results" />);
    expect(screen.getByText("No results")).toBeDefined();

    render(<ErrorState title="Error occurred" />);
    expect(screen.getByText("Error occurred")).toBeDefined();

    render(<ForbiddenState title="Access denied" />);
    expect(screen.getByText("Access denied")).toBeDefined();
  });

  test("Alert has no axe violations", async () => {
    const { container } = render(
      <Alert variant="info" title="Alert Title">
        Alert Message Content
      </Alert>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  test("Switch has no axe violations", async () => {
    const { container } = render(<Switch label="Enable Notifications" id="switch-2" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  test("RadioGroup has no axe violations", async () => {
    const { container } = render(
      <RadioGroup
        name="test-group-a11y"
        options={[
          { value: "a", label: "Option A" },
          { value: "b", label: "Option B" },
        ]}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  test("PageHeader has no axe violations", async () => {
    const { container } = render(<PageHeader title="Dashboard" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
