import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FormProvider, useForm } from 'react-hook-form';
import FormDatePicker from '@/components/form-date-picker'; // Adjust import path

// Mock DatePicker component
vi.mock('@/components/ui/date-picker', () => ({
  DatePicker: ({ value, onChange, placeholder, disabled }: { value: string; onChange: (value: string) => void; placeholder: string; disabled: boolean }) => (
    <input
      type="date"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      data-testid="datepicker-input"
    />
  ),
}));

// Wrapper component to provide FormProvider and expose form methods
import { ReactNode } from 'react';

const FormWrapper = ({ children, defaultValues = {}, resolver }: { children: ReactNode; defaultValues?: Record<string, any>; resolver?: any }) => {
  const methods = useForm({ defaultValues, resolver });
  const { handleSubmit } = methods;

  const onSubmit = (data: any) => {
    // No-op submit handler for testing; validation will still run
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} data-testid="test-form">
        {children}
      </form>
    </FormProvider>
  );
};

describe('FormDatePicker', () => {
  it('renders correctly with label and placeholder', () => {
    render(
      <FormWrapper>
        <FormDatePicker name="birthDate" label="Date of Birth" placeholder="Pick a date" />
      </FormWrapper>
    );

    const label = screen.getByText('Date of Birth');
    const input = screen.getByTestId('datepicker-input');

    expect(label).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'Pick a date');
    expect(input).toHaveAttribute('type', 'date');
    expect(input).toHaveValue('');
  });

  it('renders required indicator when required is true', () => {
    render(
      <FormWrapper>
        <FormDatePicker name="birthDate" label="Date of Birth" required={true} />
      </FormWrapper>
    );

    const label = screen.getByText('Date of Birth');
    const requiredIndicator = screen.getByText('*');

    expect(label).toBeInTheDocument();
    expect(requiredIndicator).toBeInTheDocument();
    expect(requiredIndicator).toHaveClass('text-destructive');
  });

  it('renders without required indicator when required is false', () => {
    render(
      <FormWrapper>
        <FormDatePicker name="birthDate" label="Date of Birth" required={false} />
      </FormWrapper>
    );

    const label = screen.getByText('Date of Birth');
    const requiredIndicator = screen.queryByText('*');

    expect(label).toBeInTheDocument();
    expect(requiredIndicator).not.toBeInTheDocument();
  });

  it('disables the date picker when disabled is true', () => {
    render(
      <FormWrapper>
        <FormDatePicker name="birthDate" label="Date of Birth" disabled={true} />
      </FormWrapper>
    );

    const input = screen.getByTestId('datepicker-input');
    expect(input).toBeDisabled();
  });

  it('updates form value when date is selected', () => {
    const onSubmit = vi.fn();
    const defaultValues = { birthDate: '' };

    const { getByTestId } = render(
      <FormWrapper defaultValues={defaultValues}>
        <FormDatePicker name="birthDate" label="Date of Birth" />
        <button type="submit" onClick={() => onSubmit()}>Submit</button>
      </FormWrapper>
    );

    const input = getByTestId('datepicker-input');
    fireEvent.change(input, { target: { value: '2023-05-15' } });

    expect(input).toHaveValue('2023-05-15');
  });

  it('displays default value from form context', () => {
    const defaultValues = { birthDate: '2023-01-01' };

    render(
      <FormWrapper defaultValues={defaultValues}>
        <FormDatePicker name="birthDate" label="Date of Birth" />
      </FormWrapper>
    );

    const input = screen.getByTestId('datepicker-input');
    expect(input).toHaveValue('2023-01-01');
  });

  it('shows validation error when required field is empty', async () => {
    const { getByTestId } = render(
      <FormWrapper
        resolver={async (data: Record<string, any>) => ({
          values: data,
          errors: !data.birthDate ? { birthDate: { type: 'required', message: 'This field is required' } } : {},
        })}
      >
        <FormDatePicker name="birthDate" label="Date of Birth" required={true} />
        <button type="submit">Submit</button>
      </FormWrapper>
    );

    const form = screen.getByTestId('test-form');
    fireEvent.submit(form);

    const errorMessage = await screen.findByText('This field is required');
    expect(errorMessage).toBeInTheDocument();

    const input = getByTestId('datepicker-input');
    expect(input).toHaveValue('');
  });
});