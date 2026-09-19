import type { Meta, StoryObj } from "@storybook/react";
import { AssessmentRubricMatrix } from "./assessment-rubric-matrix";

const meta: Meta<typeof AssessmentRubricMatrix> = {
  title: "Data Display/AssessmentRubricMatrix",
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

export const AnatomyAndComposition: Story = {
  args: {
    title: "Senior Staff Engineering Calibration Rubric",
    subjectName: "Review Subject: Alex Chen",
    initialSelections: {
      arch: "arch-4",
      sec: "sec-5",
    },
  },
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", inlineSize: "100%" }}>
      <div>
        <h4 style={{ marginBlockEnd: "0.5rem" }}>Partially Scored</h4>
        <AssessmentRubricMatrix
          title="Senior Staff Engineering Calibration Rubric"
          subjectName="Review Subject: Alex Chen"
          initialSelections={{ arch: "arch-4", sec: "sec-5" }}
        />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "0.5rem" }}>Unscored Evaluation</h4>
        <AssessmentRubricMatrix
          title="Quarterly Performance Rubric"
          subjectName="Review Subject: Jordan Lee"
          initialSelections={{}}
        />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "0.5rem" }}>Read Only Mode</h4>
        <AssessmentRubricMatrix
          title="Archived Annual Review"
          subjectName="Review Subject: Taylor Swift"
          readOnly
          initialSelections={{ arch: "arch-5", sec: "sec-5", a11y: "a11y-5" }}
        />
      </div>
    </div>
  ),
};

export const UnscoredEvaluation: Story = {
  args: {
    title: "Quarterly Performance Rubric",
    subjectName: "Review Subject: Jordan Lee",
    initialSelections: {},
  },
};
