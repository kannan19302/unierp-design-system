import type { Meta, StoryObj } from "@storybook/react";
import { BulkActionBar, ContextualSaveBar } from "./bulk-action-bar";
import { Button } from "../../primitives/button";

const meta: Meta = {
  title: "Forms/BulkActionBar",
  tags: ["autodocs"],
};

export default meta;

export const BulkBar = () => (
  <BulkActionBar
    selectedCount={12}
    onClearSelection={() => alert("Cleared")}
    actions={
      <>
        <Button variant="outline" size="sm">Export Selected</Button>
        <Button variant="danger" size="sm">Purge Records</Button>
      </>
    }
  />
);

export const ContextualSave = () => (
  <ContextualSaveBar
    visible={true}
    onSave={() => alert("Saved")}
    onDiscard={() => alert("Discarded")}
  />
);
