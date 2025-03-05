import React from "react";
import deleteIcon from "../../../assets/images/timesheet-row-delete.svg";
import DropdownSelect from "./DropdownSelect";

const TimesheetRow = ({
                        row,
                        onDelete,
                        onChangeRowData,
                        projects
                      }) => {
  const filteredData = projects.filter(project =>
    (!row.company || project.attributes.company === row.company) &&
    (!row.project_name || project.attributes.name === row.project_name)
  );
  const optionsCompanyNames = [...new Set(filteredData.map(project => project.attributes.company))];
  const optionsProjectIds = filteredData.map(project => project.attributes.code);
  const optionsProjectNames = [...new Set(filteredData.map(project => project.attributes.name))];

  const updateProjectByKey = (searchKey, value, fieldName) => {
    const project = projects.find(project => project.attributes[searchKey] === value);
    if (project) {
      onChangeRowData(row.id, {
        company: project.attributes.company,
        project_id: project.attributes.code,
        project_name: project.attributes.name
      });
    } else {
      onChangeRowData(row.id, {[fieldName]: value});
    }
  };

  const handleCompanyChange = (value) => {
    onChangeRowData(row.id, {
      company: value,
      project_id: "",
    });
  };
  const handleProjectIdChange = (value) => {
    updateProjectByKey("code", value, "project_id");
  };
  const handleProjectNameChange = (value) => {
    onChangeRowData(row.id, {project_name: value});
  };
  const handleTimeChange = (event) => {
    const value = event.target.value;
    if (value === '' || (/^\d+$/.test(value) && parseInt(value, 10) > 0)) {
      onChangeRowData(row.id, {time: value});
    }
  };

  return (
    <div className="position-relative d-flex gap-1 flex-column flex-lg-row flex-nowrap align-items-center w-100">
      <div className="timesheet-row d-flex gap-1 flex-column flex-lg-row flex-nowrap align-items-center border border-royal-blue border-4 p-1 px-sm-5 px-md-8 px-lg-1 w-100">
        <DropdownSelect
          id={'company_name'}
          options={optionsCompanyNames}
          selected={row.company}
          onChange={handleCompanyChange}
          placeholder="Enter company"
          className="select-company"
        />
        <DropdownSelect
          id={'project_id'}
          options={optionsProjectIds}
          selected={row.project_id}
          onChange={handleProjectIdChange}
          placeholder="Enter project ID"
          className="select-project-id"
        />
        <DropdownSelect
          id={'project_name'}
          options={optionsProjectNames}
          selected={row.project_name}
          onChange={handleProjectNameChange}
          placeholder="Enter project name"
          className="select-project-name"
        />
        <input
          type="text"
          value={row.time}
          onChange={handleTimeChange}
          placeholder="Enter time"
          className="timesheet-row-input-time select-time text-ellipsis w-100 border-royal-blue border-4 border outline-focus-none text-center shadow-none fw-normal text-gray-700"
        />
      </div>
      <button
        className="position-absolute timesheet-row-button-delete bg-white border-4 border border-royal-blue rounded-circle"
        onClick={() => onDelete(row.id)}
      >
        <img src={deleteIcon} alt="Delete icon" className={"img-fluid"}/>
      </button>
    </div>
  );
};

export default TimesheetRow;
