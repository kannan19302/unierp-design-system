import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { ConditionalFieldGroup } from "./conditional-field-group";

const defaultProps = {} as any;

describe("ConditionalFieldGroup", () => {
  it("renders without crashing", () => {
    render(<ConditionalFieldGroup {...defaultProps} triggerLabel="Payment Method" triggerOptions={['Wire Transfer', 'Credit Card', 'ACH']} groups={{ 'Wire Transfer': <div>Bank Name, Routing Number, Account Number fields</div>, 'Credit Card': <div>Card Number, Expiry, CVV fields</div>, 'ACH': <div>Bank, Account, Routing fields</div> }} />);
    expect(document.querySelector('[class*="container"]')).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<ConditionalFieldGroup {...defaultProps} triggerLabel="Payment Method" triggerOptions={['Wire Transfer', 'Credit Card', 'ACH']} groups={{ 'Wire Transfer': <div>Bank Name, Routing Number, Account Number fields</div>, 'Credit Card': <div>Card Number, Expiry, CVV fields</div>, 'ACH': <div>Bank, Account, Routing fields</div> }} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
