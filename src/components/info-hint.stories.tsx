import type { Meta, StoryObj } from "@storybook/react";
import { InfoHint } from "./info-hint";

const meta: Meta = {
  title: "Components/InfoHint",
};

export default meta;

export const Default: StoryObj = {
  render: () => <InfoHint hint="This field is used to identify the entity uniquely." />,
};
