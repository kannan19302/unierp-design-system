import type { Meta, StoryObj } from "@storybook/react";
import {
  Switch,
  Checkbox,
  RadioGroup,
  Slider,
  NumberInput,
  CurrencyInput,
  PercentInput,
  TagInput,
} from "./extended-inputs";

const meta: Meta = {
  title: "Components/ExtendedInputs",
};

export default meta;

export const SwitchDefault: StoryObj = {
  render: () => <Switch label="Enable notifications" defaultChecked />,
};

export const CheckboxDefault: StoryObj = {
  render: () => <Checkbox label="Accept terms and conditions" defaultChecked />,
};

export const RadioGroupDefault: StoryObj = {
  render: () => (
    <RadioGroup
      name="plan"
      options={[
        { label: "Free", value: "free" },
        { label: "Pro", value: "pro" },
      ]}
      value="pro"
      onChange={() => {}}
    />
  ),
};

export const SliderDefault: StoryObj = {
  render: () => <Slider min={0} max={100} value={50} />,
};

export const NumberInputDefault: StoryObj = {
  render: () => <NumberInput value={10} />,
};

export const CurrencyInputDefault: StoryObj = {
  render: () => <CurrencyInput value={99.99} currencySymbol="$" />,
};

export const PercentInputDefault: StoryObj = {
  render: () => <PercentInput value={15} />,
};

export const TagInputDefault: StoryObj = {
  render: () => <TagInput tags={["React", "TypeScript"]} onTagsChange={() => {}} />,
};
