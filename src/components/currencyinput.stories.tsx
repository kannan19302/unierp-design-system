import type { Meta, StoryObj } from '@storybook/react';
import { CurrencyInput } from './extended-inputs';

export default { title: 'Components/CurrencyInput' } as Meta;
export const Default: StoryObj = { render: () => <CurrencyInput /> };
