import type { Meta, StoryObj } from '@storybook/react';
import { NumberInput } from './extended-inputs';

export default { title: 'Components/NumberInput' } as Meta;
export const Default: StoryObj = { render: () => <NumberInput /> };
