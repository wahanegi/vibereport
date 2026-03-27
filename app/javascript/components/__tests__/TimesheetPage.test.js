import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TimesheetPage from '../Pages/TimesheetPage';
import { apiRequest } from '../requests/axios_requests';

jest.mock('../helpers/helpers', () => ({
  calculateBillableHours: jest.fn(() => 0),
  calculateTotalHours: jest.fn((rows) =>
    rows.reduce((total, row) => total + (parseInt(row.time, 10) || 0), 0)
  ),
  rangeFormat: jest.fn(() => 'Jan 6 - Jan 10'),
  transformTimesheetEntry: jest.fn((entry, includedProjects = []) => {
    const projectId = entry.relationships?.project?.data?.id;
    const project = includedProjects.find((p) => p.id === projectId);

    return {
      id: entry.id,
      company: project?.attributes.company || '',
      project_id: projectId || '',
      project_name: project?.attributes.name_with_code || '',
      time: entry.attributes.total_hours?.toString() || '',
    };
  }),
  updateRowData: jest.fn((rows, id, updates) =>
    rows.map((row) => (row.id === id ? { ...row, ...updates } : row))
  ),
  validateRow: jest.fn((row) => Boolean(row.company && row.project_id && row.project_name && row.time)),
}));

jest.mock('../Layout', () => ({ children }) => <div>{children}</div>);

jest.mock('../UI/BlockLowerBtns', () => ({ disabled, handlingOnClickNext }) => (
  <button data-testid="submit-btn" disabled={disabled} onClick={handlingOnClickNext}>
    Submit
  </button>
));

jest.mock('../UI/ShareContent', () => ({
  BtnAddNewRow: ({ onClick, disabled }) => (
    <button data-testid="add-row-btn" disabled={disabled} onClick={onClick}>
      Add row
    </button>
  ),
  Calendar: ({ date }) => <div>{date}</div>,
}));

jest.mock('../UI/TimesheetRow', () => () => <div>Timesheet row</div>);
jest.mock('../UI/SweetAlert', () => jest.fn());
jest.mock('../requests/axios_requests', () => ({
  apiRequest: jest.fn(),
}));

describe('TimesheetPage', () => {
  const projectsResponse = [
    {
      id: '1',
      attributes: {
        company: 'Company A',
        name_with_code: 'Project A',
        usage: 'internal',
      },
    },
    {
      id: '2',
      attributes: {
        company: 'Company B',
        name_with_code: 'Project B',
        usage: 'internal',
      },
    },
  ];

  let entriesResponse;

  const baseProps = {
    data: {
      time_period: {
        first_working_day: '2025-01-06',
        last_working_day: '2025-01-10',
      },
    },
    setData: jest.fn(),
    saveDataToDb: jest.fn(),
    steps: [],
    service: {
      isLoading: false,
      setIsLoading: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    entriesResponse = {
      data: [
        {
          id: '10',
          attributes: { total_hours: 100 },
          relationships: { project: { data: { id: '1' } } },
        },
        {
          id: '11',
          attributes: { total_hours: 69 },
          relationships: { project: { data: { id: '2' } } },
        },
      ],
      included: projectsResponse,
    };

    apiRequest.mockImplementation((method, payload, onSuccess, redirect, url) => {
      if (method === 'GET' && url === '/api/v1/projects') {
        onSuccess({ data: projectsResponse });
      }

      if (method === 'GET' && url === '/api/v1/time_sheet_entries') {
        onSuccess(entriesResponse);
      }

      return Promise.resolve();
    });
  });

  it('disables submit and shows an error when period total exceeds 168 hours', async () => {
    render(<TimesheetPage {...baseProps} />);

    expect(
      await screen.findByText('Total hours per period must not exceed 168')
    ).toBeInTheDocument();
    expect(screen.getByTestId('submit-btn')).toBeDisabled();
  });

  it('enables submit and hides aggregate error when period total is exactly 168', async () => {
    entriesResponse = {
      data: [
        {
          id: '10',
          attributes: { total_hours: 100 },
          relationships: { project: { data: { id: '1' } } },
        },
        {
          id: '11',
          attributes: { total_hours: 68 },
          relationships: { project: { data: { id: '2' } } },
        },
      ],
      included: projectsResponse,
    };

    render(<TimesheetPage {...baseProps} />);

    expect(
      screen.queryByText('Total hours per period must not exceed 168')
    ).not.toBeInTheDocument();
    expect(screen.getByTestId('submit-btn')).toBeEnabled();
  });
});
