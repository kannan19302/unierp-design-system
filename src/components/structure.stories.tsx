import type { Meta, StoryObj } from "@storybook/react";
import { Container, Grid, Stack, Divider } from "./structure";

const meta: Meta = {
  title: "Components/Structure",
};

export default meta;

export const ContainerDefault: StoryObj = {
  render: () => <Container>Container Content</Container>,
};

export const GridDefault: StoryObj = {
  render: () => (
    <Grid cols={3} gap="md">
      <div>Col 1</div>
      <div>Col 2</div>
      <div>Col 3</div>
    </Grid>
  ),
};

export const StackDefault: StoryObj = {
  render: () => (
    <Stack direction="column" gap="sm">
      <div>Row 1</div>
      <div>Row 2</div>
    </Stack>
  ),
};

export const DividerDefault: StoryObj = {
  render: () => <Divider />,
};
