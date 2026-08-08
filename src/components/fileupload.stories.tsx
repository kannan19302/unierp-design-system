import type { Meta, StoryObj } from '@storybook/react';
import { FileUpload } from './heavy-inputs';

export default { title: 'Components/FileUpload' } as Meta;
export const Default: StoryObj = { render: () => <FileUpload /> };
