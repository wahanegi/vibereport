import React from 'react';

const TimesheetRowHeader = () => {
  return (
      <div
          className={'d-none d-lg-flex justify-content-center mb-3'}>
        <div
            className="timesheet-header d-flex gap-1 flex-row flex-nowrap align-items-center w-100 fs-6 border border-royal-blue border-4 rounded-4 p-1">
          <div
              className="timesheet-header-cell select-company text-center bg-light border border-royal-blue border-4 rounded-4 fw-semibold">Company
          </div>
          <div
              className="timesheet-header-cell select-project-id text-center bg-light border border-royal-blue border-4 rounded-4 fw-semibold">Project
            ID
          </div>
          <div
              className="timesheet-header-cell select-project-name text-center bg-light border border-royal-blue border-4 rounded-4 fw-semibold">Project
            Name
          </div>
          <div
              className="timesheet-header-cell select-time text-center bg-light border border-royal-blue border-4 rounded-4 fw-semibold">Time
          </div>
        </div>
      </div>
  );
};

export default TimesheetRowHeader;