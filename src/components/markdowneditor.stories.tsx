import type { Meta, StoryObj } from '@storybook/react';
import { MarkdownEditor } from './heavy-inputs';

export default { title: 'Components/MarkdownEditor' } as Meta;
export const Default: StoryObj = { render: () => <MarkdownEditor /> };
