import type { Meta, StoryObj } from '@storybook/react';
import { SignaturePad } from './heavy-inputs';

export default { title: 'Components/SignaturePad' } as Meta;
export const Default: StoryObj = { render: () => <SignaturePad /> };
