import type { Meta, StoryObj } from "@storybook/react";
import { RestApiClientWorkbench } from "./rest-api-client-workbench";

const meta: Meta<typeof RestApiClientWorkbench> = {
  title: "DataDisplay/RestApiClientWorkbench",
  component: RestApiClientWorkbench,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof RestApiClientWorkbench>;

export const Default: Story = {
  args: {
    initialMethod: "POST",
    initialUrl: "https://api.enterprise.unierp.com/v1/ledger/journal-entries",
  },
};

export const UltraCompact: Story = {
  args: {
    initialMethod: "POST",
    initialUrl: "https://api.enterprise.unierp.com/v1/ledger/journal-entries",
    density: "ultra-compact",
  },
};

export const AnatomyAndComposition: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <RestApiClientWorkbench {...args} />
    </div>
  ),
  args: {
    initialMethod: "POST",
    initialUrl: "https://api.enterprise.unierp.com/v1/ledger/journal-entries",
  },
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      <div>
        <h4 style={{ marginBottom: "8px" }}>Standard Density</h4>
        <RestApiClientWorkbench
          initialMethod="POST"
          initialUrl="https://api.enterprise.unierp.com/v1/ledger/journal-entries"
          density="standard"
        />
      </div>
      <div>
        <h4 style={{ marginBottom: "8px" }}>Ultra Compact Density</h4>
        <RestApiClientWorkbench
          initialMethod="GET"
          initialUrl="https://api.enterprise.unierp.com/v1/health"
          density="ultra-compact"
        />
      </div>
    </div>
  ),
};

