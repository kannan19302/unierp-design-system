import type { Meta, StoryObj } from "@storybook/react";
import { RestApiClientWorkbench } from "./rest-api-client-workbench";

const meta: Meta<typeof RestApiClientWorkbench> = {
  title: "Data Display/RestApiClientWorkbench",
  component: RestApiClientWorkbench,
  parameters: {
    layout: "padded",
  },
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
