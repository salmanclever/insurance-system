import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { formatDate } from '@/lib/utils';
import { generatePDF } from '@/lib/pdf-generator';
import { useToast } from '@/hooks/use-toast';
import ApplicationDetailsModal from '@/components/application-details-modal';

// Mock dependencies
vi.mock('@/lib/pdf-generator', () => ({
  generatePDF: vi.fn(),
}));

vi.mock('@/hooks/use-toast', () => ({
    useToast: vi.fn().mockReturnValue({
      toast: vi.fn(), // Mock toast function
      dismiss: vi.fn(), // Mock dismiss function (if used)
      toasts: [], // Mock toasts array (if used)
    }),
  }));

describe('ApplicationDetailsModal', () => {
  // Sample application data for testing
  const mockApplication = {
    id: '123',
    insuranceType: 'Health Insurance',
    status: 'Pending',
    submittedAt: '2023-10-01T12:00:00Z',
    formData: {
      fullName: 'John Doe',
      age: 30,
      hasPreExistingConditions: false,
    },
  };

  const mockOnOpenChange = vi.fn();

  // Test 1: Rendering the component with application data
  it('renders correctly with application data', () => {
    render(
      <ApplicationDetailsModal
        application={mockApplication}
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    );

    // Check modal title and description
    expect(screen.getByText('Application Details')).toBeInTheDocument();
    expect(screen.getByText(`Submitted on ${formatDate(mockApplication.submittedAt)}`)).toBeInTheDocument();

    // Check insurance type and application ID
    expect(screen.getByText('Health Insurance')).toBeInTheDocument();
    expect(screen.getByText('Application ID: 123')).toBeInTheDocument();

    // Check status
    expect(screen.getByText('Pending')).toBeInTheDocument();

    // Check form data fields
    expect(screen.getByText('Full Name')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('Has Pre Existing Conditions')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();

    // Check Download PDF button
    expect(screen.getByText('Download PDF')).toBeInTheDocument();
  });

  // Test 2: Successful PDF download
  it('calls generatePDF and shows success toast on download', async () => {
    const toastMock = vi.fn();
    vi.mocked(useToast).mockReturnValue({
      toast: toastMock,
      dismiss: vi.fn(),
      toasts: [],
    });
    vi.mocked(generatePDF).mockResolvedValueOnce(undefined);

    render(
      <ApplicationDetailsModal
        application={mockApplication}
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    );

    const downloadButton = screen.getByText('Download PDF');
    fireEvent.click(downloadButton);

    // Check loading state
    expect(screen.getByText('Generating PDF...')).toBeInTheDocument();

    // Wait for async operation to complete
    await waitFor(() => {
      expect(generatePDF).toHaveBeenCalledWith(mockApplication);
      expect(toastMock).toHaveBeenCalledWith({
        title: 'PDF Downloaded',
        description: 'Your application PDF has been generated and downloaded.',
      });
    });

    // Check that loading state is gone
    expect(screen.queryByText('Generating PDF...')).not.toBeInTheDocument();
    expect(screen.getByText('Download PDF')).toBeInTheDocument();
  });

  // Test 3: Failed PDF generation
  it('handles PDF generation error and shows error toast', async () => {
    const toastMock = vi.fn();
    vi.mocked(useToast).mockReturnValue({
      toast: toastMock,
      dismiss: vi.fn(),
      toasts: [],
    });
    vi.mocked(generatePDF).mockRejectedValueOnce(new Error('PDF generation failed'));

    render(
      <ApplicationDetailsModal
        application={mockApplication}
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    );

    const downloadButton = screen.getByText('Download PDF');
    fireEvent.click(downloadButton);

    // Check loading state
    expect(screen.getByText('Generating PDF...')).toBeInTheDocument();

    // Wait for async operation to complete
    await waitFor(() => {
      expect(generatePDF).toHaveBeenCalledWith(mockApplication);
      expect(toastMock).toHaveBeenCalledWith({
        title: 'Download Failed',
        description: 'There was an error generating the PDF. Please try again.',
        variant: 'destructive',
      });
    });

    // Check that loading state is gone
    expect(screen.queryByText('Generating PDF...')).not.toBeInTheDocument();
    expect(screen.getByText('Download PDF')).toBeInTheDocument();
  });

  // Test 4: Does not render when application is null
  it('does not render when application is null', () => {
    const { container } = render(
      <ApplicationDetailsModal
        application={null}
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    );

    expect(container.firstChild).toBeNull();
  });
});