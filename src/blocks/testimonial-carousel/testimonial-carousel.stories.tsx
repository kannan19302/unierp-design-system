import type { Meta, StoryObj } from "@storybook/react";
import { TestimonialCarousel } from "./testimonial-carousel";

const meta: Meta<typeof TestimonialCarousel> = {
  title: "Blocks/TestimonialCarousel",
  component: TestimonialCarousel,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof TestimonialCarousel>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 600, padding: "var(--space-4)" }}>
      <TestimonialCarousel testimonials={[{ quote: 'UniERP transformed how we manage our global operations. The real-time dashboards alone saved us 20 hours per week.', author: 'Sarah Chen', role: 'CFO', company: 'TechVentures Inc' }, { quote: 'The best enterprise platform we have ever used. Period.', author: 'Marcus Johnson', role: 'CTO', company: 'GlobalRetail Corp' }]} />
    </div>
  ),
};
