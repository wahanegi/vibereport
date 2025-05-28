import React from 'react';
import deleteIcon from '../../../assets/images/timesheet-row-delete.svg';
import DropdownSelect from './DropdownSelect';

const TimesheetRow = ({ row, onDelete, onChangeRowData, projects }) => {
  const findProjectByNameWithCode = (value) => {
    return projects.find((project) => project.attributes.name_with_code === value);
  };

  const findProjectsByCompany = (company) => {
    return projects.filter((project) => project.attributes.company === company);
  };

  const getOptionsCompanyNames = () => {
    return [...new Set(projects.map((p) => p.attributes.company))];
  };

  const getOptionsProjectNames = (companyFilter = null) => {
    return projects
      .filter((p) => !companyFilter || p.attributes.company === companyFilter)
      .map((p) => p.attributes.name_with_code);
  };

  const resetRowFields = (fieldsToReset = {}) => {
    onChangeRowData(row.id, fieldsToReset);
  };

  const handleCompanyChange = (company) => {
    if (!company) {
      resetRowFields({ company: null, project_name: null });
      return;
    }

    const validProjects = findProjectsByCompany(company);

    let updatedProjectName = null;
    if (validProjects.length === 1) {
      updatedProjectName = validProjects[0].attributes.name_with_code;
    } else if (
      row.project_name &&
      validProjects.find(
        (p) => p.attributes.name_with_code === row.project_name
      )
    ) {
      updatedProjectName = row.project_name;
    }

    onChangeRowData(row.id, {
      company,
      project_name: updatedProjectName,
      project_id: validProjects[0].id,
    });
  };

  const handleProjectNameChange = (nameWithCode) => {
    if (!nameWithCode) {
      resetRowFields({ project_name: null });
    } else {
      const project = findProjectByNameWithCode(nameWithCode);
      if (project) {
        onChangeRowData(row.id, {
          project_name: nameWithCode,
          company: project.attributes.company,
          project_id: project.id,
        });
      }
    }
  };

  const handleTimeChange = (event) => {
    const value = event.target.value;
    if (value === '' || (/^[1-9]\d*$/.test(value) && parseInt(value, 10) > 0)) {
      onChangeRowData(row.id, { time: value });
    }
  };

  const optionsCompanyNames = getOptionsCompanyNames();
  const optionsProjectNames = getOptionsProjectNames(row.company);

  return (
    <div className="d-flex gap-1 flex-nowrap w-100 flex-column flex-md-row">
      <DropdownSelect
        id="company_name"
        options={optionsCompanyNames}
        selected={row.company}
        onChange={handleCompanyChange}
        placeholder="Company"
        className="select-company"
      />
      <DropdownSelect
        id="project_name"
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
        <img src={deleteIcon} alt="Delete icon" className="img-fluid" />
      </button>
    </div>
  );
};

export default TimesheetRow;
