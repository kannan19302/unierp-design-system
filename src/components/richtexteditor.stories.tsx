import type { Meta, StoryObj } from '@storybook/react';
import { RichTextEditor } from './heavy-inputs';

export default { title: 'Components/RichTextEditor' } as Meta;
export const Default: StoryObj = { render: () => <RichTextEditor /> };
