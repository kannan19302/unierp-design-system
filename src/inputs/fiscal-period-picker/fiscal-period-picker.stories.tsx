import type { Meta, StoryObj } from "@storybook/react";
import { FiscalPeriodPicker } from "./fiscal-period-picker";

const meta: Meta<typeof FiscalPeriodPicker> = {
  title: "Inputs/FiscalPeriodPicker",
  component: FiscalPeriodPicker,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof FiscalPeriodPicker>;

export const CalendarYear: Story = {
  args: {
    fiscalYear: 2026,
    fiscalYearStartMonth: 1,
  },
};

export const UKFiscalYear: Story = {
  args: {
    fiscalYear: 2026,
    fiscalYearStartMonth: 4,
  },
};
