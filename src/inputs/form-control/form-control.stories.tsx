import type { Meta, StoryObj } from "@storybook/react";
import { TextField, Input, Textarea, Select, FormField } from "./form-control";
import { Search, Mail } from "lucide-react";

const meta: Meta<typeof TextField> = {
  title: "Inputs/FormControl",
  component: TextField,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TextField>;

export const Default: Story = {
  args: {
    label: "Company Name",
    placeholder: "Acme Industrial Corp",
  },
};

export const WithError: Story = {
  args: {
    label: "Account Number",
    placeholder: "GL-10492",
    error: "Account number is required and must be alphanumeric.",
    required: true,
  },
};

export const WithPrefixIcon = () => (
  <FormField label="Search Ledger" htmlFor="ledger-search">
    <Input
      id="ledger-search"
      placeholder="Search accounts or transaction hashes..."
      prefixIcon={<Search size={14} />}
    />
  </FormField>
);

export const SelectAndTextarea = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", width: 320 }}>
    <FormField label="Tax Jurisdiction" required>
      <Select defaultValue="US-NY">
        <option value="US-NY">New York (US-NY)</option>
        <option value="US-CA">California (US-CA)</option>
        <option value="EU-DE">Germany (EU-DE)</option>
        <option value="UK-GB">United Kingdom (UK-GB)</option>
      </Select>
    </FormField>

    <FormField label="Journal Entry Description" hint="Maximum 250 characters">
      <Textarea placeholder="Enter detailed posting narration..." rows={3} />
    </FormField>
  </div>
);
