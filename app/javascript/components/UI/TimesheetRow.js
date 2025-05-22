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
  const filteredDataForProjectName = projects.filter(project =>
    row.project_id
      ? project.attributes.code === row.project_id
      : row.company
        ? project.attributes.company === row.company
        : true
  );
  const optionsProjectNames = [...new Set(filteredDataForProjectName.map(project => project.attributes.name))];

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
    if (value === '' || (/^[1-9]\d*$/.test(value) && parseInt(value, 10) > 0)) {
      onChangeRowData(row.id, { time: value });
    }
  };

  return (
    <div className="d-flex gap-1 flex-nowrap w-100 flex-column flex-md-row">
      <DropdownSelect
        id={'company_name'}
        options={optionsCompanyNames}
        selected={row.company}
        onChange={handleCompanyChange}
        placeholder="Company"
        className="select-company"
      />
      <DropdownSelect
        id={'project_name'}
        options={optionsProjectNames}
        selected={row.project_name}
        onChange={handleProjectNameChange}
        placeholder="Project"
        className="select-project-name"
      />
      <input
        type="text"
        value={row.time}
        onChange={handleTimeChange}
        placeholder="Hours"
        className="timesheet-row-input-time select-time text-ellipsis w-100 border-royal-blue border-4 border outline-focus-none text-center shadow-none fw-normal text-gray-700"
      />
      <button className="border-0 bg-white" onClick={() => onDelete(row.id)}>
        <img src={deleteIcon} alt="Delete icon" className={'img-fluid'} />
      </button>
    </div>
  );
};

export default TimesheetRow;
