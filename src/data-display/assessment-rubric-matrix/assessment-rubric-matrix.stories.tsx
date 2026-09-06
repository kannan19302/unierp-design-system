import type { Meta, StoryObj } from "@storybook/react";
import { AssessmentRubricMatrix } from "./assessment-rubric-matrix";

const meta: Meta<typeof AssessmentRubricMatrix> = {
  title: "DataDisplay/AssessmentRubricMatrix",
  component: AssessmentRubricMatrix,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AssessmentRubricMatrix>;

export const DefaultEngineeringReview: Story = {
  args: {
    title: "Senior Staff Engineering Calibration Rubric",
    subjectName: "Review Subject: Alex Chen",
    initialSelections: {
      arch: "arch-4",
      sec: "sec-5",
    },
  },
};

export const UnscoredEvaluation: Story = {
  args: {
    title: "Quarterly Performance Rubric",
    subjectName: "Review Subject: Jordan Lee",
    initialSelections: {},
  },
};
