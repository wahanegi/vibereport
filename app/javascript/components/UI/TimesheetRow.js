import React from "react";
import deleteIcon from "../../../assets/images/timesheet-row-delete.svg";
import DropdownSelect from "./DropdownSelect";

// TODO - initOpt will be deleted after implementing data fetching from the backend.
const initOpt = [
  'Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5',
  'Option 6', 'Option 7', 'Option 8', 'Option 9', 'Option 10', 'Option 11'
];

const TimesheetRow = ({
                        row,
                        onDelete,
                        onChangeRowData,
                        optionsCompanyNames = initOpt,
                        optionsProjectIds = initOpt,
                        optionsProjectNames = initOpt
                      }
) => {
  return <div className="d-flex gap-1 flex-row flex-nowrap align-items-center">
    <div
      className="timesheet-row d-flex gap-1 flex-row flex-nowrap border-royal-blue border border-4 w-100 align-items-center p-1">
      <DropdownSelect id={"company_name"}
                      options={optionsCompanyNames}
                      selected={row.company}
                      onChange={(value) => onChangeRowData(row.id, "company", value)}
                      placeholder="Select..."
                      className="select-company"
      />
      <DropdownSelect id={"project_id"}
                      options={optionsProjectIds}
                      selected={row.project_id}
                      onChange={(value) => onChangeRowData(row.id, "project_id", value)}
                      placeholder="Select..."
                      className="select-project-id"
      />
      <DropdownSelect id={"project_name"}
                      options={optionsProjectNames}
                      selected={row.project_name}
                      onChange={(value) => onChangeRowData(row.id, "project_name", value)}
                      placeholder="Select..."
                      className="select-project-name"
      />
      <input
        type="number"
        value={row.time}
        onChange={(event) => onChangeRowData(row.id, "time", event.target.value)}
        min={0}
        placeholder=""
        className="timesheet-row-input-time select-time shadow-none fs-5 text-gray-600 text fw-normal border-royal-blue border-4 border"
      />
    </div>
    <button className="timesheet-row-button-delete bg-white border-4 border border-royal-blue rounded-circle"
            onClick={() => onDelete(row.id)}>
      <img src={deleteIcon} alt="Delete icon"/>
    </button>
  </div>
};

export default TimesheetRow;