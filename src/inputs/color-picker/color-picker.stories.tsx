import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ColorPicker, type ColorPickerProps } from "./color-picker";

const meta: Meta<typeof ColorPicker> = {
  title: "Inputs/ColorPicker",
  component: ColorPicker,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof ColorPicker>;

function InteractiveColorPicker(props: Partial<ColorPickerProps>) {
  const [color, setColor] = useState("#0e6b75");
  return (
    <ColorPicker
      label="Brand Theme Color"
      value={color}
      onChange={setColor}
      {...props}
    />
  );
}

export const Default: Story = {
  render: () => <InteractiveColorPicker />,
};

export const CustomPresets: Story = {
  render: () => (
    <InteractiveColorPicker
      presetColors={[
        "#1d4ed8",
        "#047857",
        "#6d28d9",
        "#b45309",
        "#be123c",
        "#0f766e",
      ]}
    />
  ),
};

export const Disabled: Story = {
  render: () => <InteractiveColorPicker disabled />,
};
