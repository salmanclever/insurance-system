import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FormProvider, useForm } from 'react-hook-form';
import DynamicField from '@/components/dynamic-field'; // Adjust import path
import FormDatePicker from '@/components/form-date-picker'; // Adjust import path

// Mock FormDatePicker since it's a separate component
vi.mock('@/components/form-date-picker', () => ({
  default: ({ name, label, placeholder, required }: { name: string; label: string; placeholder: string; required: boolean }) => (
    <div data-testid={`datepicker-${name}`}>
      <label>{label}{required ? ' *' : ''}</label>
      <input type="date" placeholder={placeholder} />
    </div>
  ),
}));

// Wrapper component to provide FormProvider
import { ReactNode } from 'react';

const FormWrapper = ({ children, defaultValues = {} }: { children: ReactNode; defaultValues?: object }) => {
  const methods = useForm({ defaultValues });
  return <FormProvider {...methods}>{children}</FormProvider>;
};

describe('DynamicField', () => {
  it('renders a text input field correctly', () => {
    const field = {
      id: 'fullName',
      type: 'text',
      label: 'Full Name',
      placeholder: 'Enter your full name',
      required: true,
    };

    render(
      <FormWrapper>
        <DynamicField field={field} />
      </FormWrapper>
    );

    const label = screen.getByText('Full Name *');
    const input = screen.getByPlaceholderText('Enter your full name');

    expect(label).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveValue('');
  });

  it('renders an email input field correctly', () => {
    const field = {
      id: 'email',
      type: 'email',
      label: 'Email Address',
      placeholder: 'Enter your email',
      required: false,
    };

    render(
      <FormWrapper>
        <DynamicField field={field} />
      </FormWrapper>
    );

    const label = screen.getByText('Email Address');
    const input = screen.getByPlaceholderText('Enter your email');

    expect(label).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveValue('');
  });

  it('renders a number input field and handles value changes', () => {
    const field = {
      id: 'age',
      type: 'number',
      label: 'Age',
      placeholder: 'Enter your age',
      min: 18,
      max: 100,
      required: true,
    };

    render(
      <FormWrapper>
        <DynamicField field={field} />
      </FormWrapper>
    );

    const label = screen.getByText('Age *');
    const input = screen.getByPlaceholderText('Enter your age');

    expect(label).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'number');
    expect(input).toHaveAttribute('min', '18');
    expect(input).toHaveAttribute('max', '100');

    fireEvent.change(input, { target: { value: '25' } });
    expect(input).toHaveValue(25);
  });

  it('renders a textarea field correctly', () => {
    const field = {
      id: 'comments',
      type: 'textarea',
      label: 'Comments',
      placeholder: 'Enter your comments',
    };

    render(
      <FormWrapper>
        <DynamicField field={field} />
      </FormWrapper>
    );

    const label = screen.getByText('Comments');
    const textarea = screen.getByPlaceholderText('Enter your comments');

    expect(label).toBeInTheDocument();
    expect(textarea.tagName).toBe('TEXTAREA');
    expect(textarea).toHaveValue('');
  });

  it('renders a select field and handles selection', () => {
    const field = {
      id: 'coverageType',
      type: 'select',
      label: 'Coverage Type',
      placeholder: 'Select coverage',
      options: [
        { label: 'Basic', value: 'basic' },
        { label: 'Premium', value: 'premium' },
      ],
      required: true,
    };

    render(
      <FormWrapper>
        <DynamicField field={field} />
      </FormWrapper>
    );

    const label = screen.getByText('Coverage Type *');
    const selectTrigger = screen.getByText('Select coverage');

    expect(label).toBeInTheDocument();
    expect(selectTrigger).toBeInTheDocument();

    // Simulate opening the select and choosing an option
    fireEvent.click(selectTrigger);
    const option = screen.getByText('Premium');
    fireEvent.click(option);

    expect(screen.getByText('Premium')).toBeInTheDocument();
  });

  it('renders a radio group field and handles selection', () => {
    const field = {
      id: 'hasConditions',
      type: 'radio',
      label: 'Has Conditions',
      options: [
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' },
      ],
    };

    render(
      <FormWrapper>
        <DynamicField field={field} />
      </FormWrapper>
    );

    const label = screen.getByText('Has Conditions');
    const yesOption = screen.getByLabelText('Yes');
    const noOption = screen.getByLabelText('No');

    expect(label).toBeInTheDocument();
    expect(yesOption).toBeInTheDocument();
    expect(noOption).toBeInTheDocument();

    fireEvent.click(yesOption);
    expect(yesOption).toBeChecked();
    expect(noOption).not.toBeChecked();
  });

  it('renders a checkbox field and handles toggling', () => {
    const field = {
      id: 'termsAgreed',
      type: 'checkbox',
      label: 'Terms Agreed',
      placeholder: 'I agree to the terms',
      required: true,
    };

    render(
      <FormWrapper>
        <DynamicField field={field} />
      </FormWrapper>
    );

    const label = screen.getByText('Terms Agreed *');
    const checkbox = screen.getByLabelText('I agree to the terms');

    expect(label).toBeInTheDocument();
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it('renders a date picker field correctly', () => {
    const field = {
      id: 'dateOfBirth',
      type: 'date',
      label: 'Date of Birth',
      placeholder: 'Pick a date',
      required: true,
    };

    render(
      <FormWrapper>
        <DynamicField field={field} />
      </FormWrapper>
    );

    const datePicker = screen.getByTestId('datepicker-dateOfBirth');
    const label = within(datePicker).getByText('Date of Birth *');
    const input = within(datePicker).getByPlaceholderText('Pick a date');

    expect(label).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'date');
  });
});