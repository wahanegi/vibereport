import React from 'react';

const TimesheetRowHeader = () => {
  return (
    <div className={"wrap-tsh-table mb-1"}>
      <div
        className="d-flex gap-1 flex-row flex-nowrap align-items-center w-100 border border-royal-blue border-4 rounded-4 p-1">
        <div
          className="table-header select-company text-center bg-light border border-royal-blue border-4 rounded-4 fw-semibold">Company
        </div>
        <div
          className="table-header select-project-id text-center bg-light border border-royal-blue border-4 rounded-4 fw-semibold">Project
          ID
        </div>
        <div
          className="table-header select-project-name text-center bg-light border border-royal-blue border-4 rounded-4 fw-semibold">Project
          Name
        </div>
        <div
          className="table-header select-time text-center bg-light border border-royal-blue border-4 rounded-4 fw-semibold">Time
        </div>
      </div>
    </div>
  );
}

export default TimesheetRowHeader;