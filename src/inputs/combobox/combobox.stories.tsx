import type { Meta, StoryObj } from "@storybook/react";
import { ComboBox } from "./combobox";

const meta: Meta<typeof ComboBox> = {
  title: "Inputs/ComboBox",
  component: ComboBox,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ComboBox>;

export const Default: Story = {
  args: {
    value: "usd",
    options: [
      { value: "usd", label: "USD - United States Dollar" },
      { value: "eur", label: "EUR - Euro" },
      { value: "gbp", label: "GBP - British Pound" },
      { value: "jpy", label: "JPY - Japanese Yen" },
      { value: "sgd", label: "SGD - Singapore Dollar" },
    ],
  },
};

export const Multiple: Story = {
  args: {
    multiple: true,
    value: ["eur", "gbp"],
    options: [
      { value: "usd", label: "USD - United States Dollar" },
      { value: "eur", label: "EUR - Euro" },
      { value: "gbp", label: "GBP - British Pound" },
      { value: "jpy", label: "JPY - Japanese Yen" },
      { value: "sgd", label: "SGD - Singapore Dollar" },
    ],
  },
};
