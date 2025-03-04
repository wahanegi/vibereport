import React from 'react';
import deleteIcon from '../../../assets/images/timesheet-row-delete.svg';
import DropdownSelect from './DropdownSelect';


const TimesheetRow = ({
  row,
  onDelete,
  onChangeRowData,
  optionsCompanyNames,
  optionsProjectCodes,
  optionsProjectNames,
}) => {
  const handleTimeChange = (event) => {
    const value = event.target.value;
    if (value === '' || (/^\d+$/.test(value) && parseInt(value, 10) > 0)) {
      onChangeRowData(row.id, 'time', value);
    }
  };

  return (
    <div className="d-flex gap-1 flex-row flex-nowrap align-items-center">
      <div className="timesheet-row d-flex gap-1 flex-row flex-nowrap align-items-center border border-royal-blue border-4 p-1">
        <DropdownSelect
          id={'company_name'}
          options={optionsCompanyNames}
          selected={row.company}
          onChange={(value) => onChangeRowData(row.id, 'company', value)}
          placeholder="Enter company"
          className="select-company"
        />
        <DropdownSelect
          id={'project_code'}
          options={optionsProjectCodes}
          selected={row.project_code}
          onChange={(value) => onChangeRowData(row.id, 'project_code', value)}
          placeholder="Enter project ID"
          className="select-project-id"
        />
        <DropdownSelect
          id={'project_name'}
          options={optionsProjectNames}
          selected={row.project_name}
          onChange={(value) => onChangeRowData(row.id, 'project_name', value)}
          placeholder="Enter project name"
          className="select-project-name"
        />
        <input
          type="text"
          value={row.time}
          onChange={handleTimeChange}
          placeholder="Enter time"
          className="timesheet-row-input-time select-time shadow-none fs-5 text-gray-600 text fw-normal border-royal-blue border-4 border w-100 outline-focus-none text-center"
        />
      </div>
      <button
        className="timesheet-row-button-delete bg-white border-4 border border-royal-blue rounded-circle"
        onClick={() => onDelete(row.id)}
      >
        <img src={deleteIcon} alt="Delete icon" />
      </button>
    </div>
  );
};

export default TimesheetRow;
