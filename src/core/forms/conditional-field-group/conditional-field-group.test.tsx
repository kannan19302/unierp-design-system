import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { ConditionalFieldGroup } from "./conditional-field-group";

describe("ConditionalFieldGroup", () => {
  it("renders trigger and displays child sub-group upon selection", () => {
    const onChange = vi.fn();
    render(
      <ConditionalFieldGroup
        triggerLabel="Payment Method"
        triggerOptions={["Wire", "Card"]}
        onChange={onChange}
        groups={{
          Wire: <div>Wire Details Form</div>,
          Card: <div>Card Details Form</div>,
        }}
      />
    );

    expect(screen.getByRole("group", { name: "Payment Method Group" })).toBeInTheDocument();
    expect(screen.queryByText("Wire Details Form")).not.toBeInTheDocument();

    const select = screen.getByLabelText("Payment Method");
    fireEvent.change(select, { target: { value: "Wire" } });

    expect(onChange).toHaveBeenCalledWith("Wire");
    expect(screen.getByText("Wire Details Form")).toBeInTheDocument();
  });

  it("forwards ref correctly to the group container", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <ConditionalFieldGroup
        ref={ref}
        triggerLabel="Test Label"
        triggerOptions={["A", "B"]}
        groups={{}}
      />
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveAttribute("role", "group");
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <ConditionalFieldGroup
        triggerLabel="Payment Method"
        triggerOptions={["Wire", "Card"]}
        defaultOption="Wire"
        groups={{ Wire: <div>Wire info</div> }}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
