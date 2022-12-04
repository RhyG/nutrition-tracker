import { RenderAPI, fireEvent } from '@testing-library/react-native';
import { renderWithProviders } from '@tests/test-utils';
import React from 'react';

import { InputWithLabel } from '../InputWithLabel';

const mockOnInputChanged = jest.fn();

const defaultProps: React.ComponentProps<typeof InputWithLabel> = {
  onInputChange: mockOnInputChanged,
  value: 'input value',
  label: 'Test Input',
};

describe('<InputWithLabel />', () => {
  let component: RenderAPI;

  const renderComponent = (props = defaultProps) => renderWithProviders(<InputWithLabel {...props} />);

  beforeEach(() => {
    component = renderComponent();
  });

  it('Should render the label received as props', () => {
    expect(component.getByTestId('input-with-label-Test Input-label')).toBeDefined();
  });

  it('Should render the value received as props', () => {
    expect(component.getByDisplayValue('input value')).toBeDefined();
  });

  it('Should render call the `onInputChanged` prop when text is entered', () => {
    fireEvent(component.getByTestId('input-with-label-Test Input-input'), 'onChangeText', 'changing input');

    expect(mockOnInputChanged).toHaveBeenCalledWith('changing input');
  });

  it('Should render a placeholder if received as props', () => {
    component = renderComponent({
      ...defaultProps,
      placeholder: 'Placeholder',
    });

    expect(component.getByPlaceholderText('Placeholder')).toBeDefined();
  });
});
