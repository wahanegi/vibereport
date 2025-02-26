import React from "react";
import DropdownSelect from "./DropdownSelect";
import deleteIcon from "../../../assets/images/timesheet-row-delete.svg";

const TimesheetRow = (
    {
        // for company name
        optionsCompanyNames,
        selectedCompany,
        onChangeCompany,
        // for project id
        optionsProjectIds,
        selectedProjectId,
        onChangeProjectId,
        // for project name
        optionsProjectNames,
        selectedProjectName,
        onChangeProjectName,
        // for delete row and send to backend
        onDelete
    }
) => {
    return <div className="d-flex gap-1 flex-row flex-nowrap align-items-center">
        <div className="timesheet-row d-flex gap-3 flex-row flex-nowrap border-royal-blue border-4 border">
            <DropdownSelect placeholder=""
                            options={optionsCompanyNames}
                            onChange={onChangeCompany}
                            selected={selectedCompany}
                            className="timesheet-row-select-company"
            />
            <DropdownSelect placeholder=""
                            options={optionsProjectIds}
                            onChange={onChangeProjectId}
                            selected={selectedProjectId}
                            className="timesheet-row-select-project-id"
            />
            <DropdownSelect placeholder=""
                            options={optionsProjectNames}
                            onChange={onChangeProjectName}
                            selected={selectedProjectName}
                            className="timesheet-row-select-project-name"
            />
            <input type="number"
                   min={0}
                   placeholder=""
                   className="timesheet-row-input-time shadow-none fs-5 text-gray-600 text fw-normal border-royal-blue border-4 border"
            />
        </div>
        <button className="timesheet-row-button-delete bg-white border-4 border border-royal-blue rounded-circle"
                onClick={onDelete}>
            <img src={deleteIcon} alt="Delete icon"/>
        </button>
    </div>
};

export default TimesheetRow;