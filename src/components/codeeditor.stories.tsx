import type { Meta, StoryObj } from '@storybook/react';
import { CodeEditor } from './heavy-inputs';

export default { title: 'Components/CodeEditor' } as Meta;
export const Default: StoryObj = { render: () => <CodeEditor /> };
