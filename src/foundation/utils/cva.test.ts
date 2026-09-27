import { describe, it, expect } from "vitest";
import { cva } from "./cva";

describe("cva utility", () => {
  it("renders base classes without variants", () => {
    const buttonVariants = cva("base-button");
    expect(buttonVariants()).toBe("base-button");
    expect(buttonVariants({ className: "custom-class" })).toBe("base-button custom-class");
  });

  it("applies default variants when no props provided", () => {
    const buttonVariants = cva("btn", {
      variants: {
        variant: {
          primary: "btn-primary",
          secondary: "btn-secondary",
        },
        size: {
          sm: "btn-sm",
          md: "btn-md",
        },
      },
      defaultVariants: {
        variant: "primary",
        size: "md",
      },
    });

    expect(buttonVariants()).toBe("btn btn-primary btn-md");
  });

  it("overrides default variants with provided props", () => {
    const buttonVariants = cva("btn", {
      variants: {
        variant: {
          primary: "btn-primary",
          secondary: "btn-secondary",
        },
        size: {
          sm: "btn-sm",
          md: "btn-md",
        },
      },
      defaultVariants: {
        variant: "primary",
        size: "md",
      },
    });

    expect(buttonVariants({ variant: "secondary", size: "sm" })).toBe("btn btn-secondary btn-sm");
  });

  it("evaluates compound variants correctly", () => {
    const buttonVariants = cva("btn", {
      variants: {
        variant: {
          primary: "btn-primary",
          secondary: "btn-secondary",
        },
        size: {
          sm: "btn-sm",
          md: "btn-md",
        },
      },
      compoundVariants: [
        {
          variant: "primary",
          size: "sm",
          className: "btn-primary-sm-compound",
        },
      ],
      defaultVariants: {
        variant: "primary",
        size: "md",
      },
    });

    expect(buttonVariants({ variant: "primary", size: "sm" })).toBe(
      "btn btn-primary btn-sm btn-primary-sm-compound"
    );
    expect(buttonVariants({ variant: "secondary", size: "sm" })).toBe("btn btn-secondary btn-sm");
  });

  it("handles boolean variants", () => {
    const cardVariants = cva("card", {
      variants: {
        elevated: {
          true: "card-shadow",
          false: "card-flat",
        },
      },
      defaultVariants: {
        elevated: false,
      },
    });

    expect(cardVariants()).toBe("card card-flat");
    expect(cardVariants({ elevated: true })).toBe("card card-shadow");
  });
});
