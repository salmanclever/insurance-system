import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event'; // Import userEvent
import { describe, it, expect, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fetchApplications } from '@/lib/api';
import { generatePDF } from '@/lib/pdf-generator';
import { useToast } from '@/hooks/use-toast';
import ApplicationsList from '@/components/applications-list';

// Mock implementations
vi.mock('@/lib/api', () => ({
  fetchApplications: vi.fn(),
}));

vi.mock('@/lib/pdf-generator', () => ({
  generatePDF: vi.fn(),
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: vi.fn() }),
}));

// Mock data matching Health Insurance structure from api.ts
const mockApplications = [
  {
    id: '1',
    insuranceType: 'Health Insurance',
    submittedAt: '2023-01-01T00:00:00Z',
    status: 'Approved',
    formData: {
      fullName: 'John Doe',
      email: 'john@example.com',
      dateOfBirth: '1990-01-01T00:00:00Z',
      hasMedicalConditions: 'no',
      coverageType: 'premium',
      termsAgreed: true,
    },
  },
  {
    id: '2',
    insuranceType: 'Health Insurance',
    submittedAt: '2023-02-01T00:00:00Z',
    status: 'Pending',
    formData: {
      fullName: 'Jane Smith',
      email: 'jane@example.com',
      dateOfBirth: '1985-02-01T00:00:00Z',
      hasMedicalConditions: 'no',
      coverageType: 'standard',
      termsAgreed: true,
    },
  },
];

describe('ApplicationsList', () => {
  it('renders the applications table and opens details modal', async () => {
    // Set the mock implementation for this test
    vi.mocked(fetchApplications).mockResolvedValue(mockApplications);

    // Set up QueryClient for React Query
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false, // Disable retries to make test faster
        },
      },
    });

    // Render the component
    render(
      <QueryClientProvider client={queryClient}>
        <ApplicationsList />
      </QueryClientProvider>
    );

    // Wait for the table to load and verify headers
    await waitFor(() => {
      expect(screen.getByText('Application ID')).toBeInTheDocument();
    });

    expect(screen.getByText('Insurance Type')).toBeInTheDocument();
    expect(screen.getByText('Submitted Date')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();

    // Check the number of rows (1 header + 2 data rows)
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(3);

    // Verify data in the first row
    const firstRow = rows[1]; // Second row is the first data row
    expect(within(firstRow).getByText('1')).toBeInTheDocument();
    expect(within(firstRow).getByText('Health Insurance')).toBeInTheDocument();
    expect(within(firstRow).getByText('Approved')).toBeInTheDocument();

    // Find the actions button in the first row
    const actionsButton = within(firstRow).getByRole('button', { name: /open menu/i });

    // Use userEvent to click the button
    await userEvent.click(actionsButton);

    // Wait for the "View details" item to appear and click it
    await waitFor(() => {
      const viewDetailsItem = screen.getByText('View details');
      expect(viewDetailsItem).toBeInTheDocument();
      userEvent.click(viewDetailsItem);
    }, { timeout: 2000 }); // Increase timeout if needed

    // Wait for the modal to appear and verify its content
    await waitFor(() => {
      expect(screen.getByText('Application Details')).toBeInTheDocument();
    });
    expect(screen.getByText(/Application ID: 1/)).toBeInTheDocument();
  });
});