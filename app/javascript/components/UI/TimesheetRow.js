import React from 'react';
import deleteIcon from '../../../assets/images/timesheet-row-delete.svg';
import DropdownSelect from './DropdownSelect';

const TimesheetRow = ({ row, onDelete, onChangeRowData, projects, rowsData }) => {
  const getSelectedProjectIds = () => {
    return rowsData
      .filter((r) => r.id !== row.id)
      .map((r) => r.project_id)
      .filter(Boolean);
  };

  const findProjectByNameWithCode = (value) => {
    return projects.find((project) => project.attributes.name_with_code === value);
  };

  const findProjectsByCompany = (company) => {
    return projects.filter((project) => project.attributes.company === company);
  };

  const isCompanyProjectsFullySelected = (company) => {
    if (!company) return false;

    const selectedIds = getSelectedProjectIds();
    const companyProjects = findProjectsByCompany(company);

    return (
      companyProjects.length > 0 &&
      companyProjects.every((p) => selectedIds.includes(p.id))
    );
  };

  const getOptionsCompanyNames = () => {
    return [...new Set(projects.map((p) => p.attributes.company))];
  };

  const getOptionsProjectNames = (companyFilter = null) => {
    const selectedProjectIds = getSelectedProjectIds();

    return projects
      .filter((p) => {
        const matchesCompany = !companyFilter || p.attributes.company === companyFilter;
        const notSelected = !selectedProjectIds.includes(p.id);
        return matchesCompany && notSelected;
      })
      .map((p) => p.attributes.name_with_code);
  };

  const handleCompanyChange = (company) => {
    if (!company) {
      onChangeRowData(row.id, {
        company: null,
        project_name: null,
        project_id: null,
      });
      return;
    }

    if (isCompanyProjectsFullySelected(company)) {
      onChangeRowData(row.id, {
        company,
        project_name: null,
        project_id: null,
      });
      return;
    }

    const validProjects = findProjectsByCompany(company);
    const selectedIds = getSelectedProjectIds();

    const availableProjects = validProjects.filter(
      (p) => !selectedIds.includes(p.id)
    );

    let updatedProjectName = null;
    let updatedProjectId = null;

    if (availableProjects.length === 1) {
      updatedProjectName = availableProjects[0].attributes.name_with_code;
      updatedProjectId = availableProjects[0].id;
    }

    onChangeRowData(row.id, {
      company,
      project_name: updatedProjectName,
      project_id: updatedProjectId,
    });
  };

  const isProjectDisabled = isCompanyProjectsFullySelected(row.company);

  const handleProjectNameChange = (nameWithCode) => {
    if (!nameWithCode) {
      onChangeRowData(row.id, {
        project_name: null,
        project_id: null
      });
      return;
    }

    const project = findProjectByNameWithCode(nameWithCode);
    if (!project) return;

    const selectedProjectIds = getSelectedProjectIds();
    if (selectedProjectIds.includes(project.id)) return;

    onChangeRowData(row.id, {
      project_name: nameWithCode,
      company: project.attributes.company,
      project_id: project.id,
    });
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
    <div className="d-flex gap-1 flex-nowrap w-100 flex-row">
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
          disabled={isProjectDisabled}
        />
        <input
          type="text"
          value={row.time}
          onChange={handleTimeChange}
          placeholder="Hours"
          className="timesheet-row-input-time select-time text-ellipsis w-100 border-royal-blue border-4 border outline-focus-none text-center shadow-none fw-normal text-gray-700"
          disabled={isProjectDisabled}
        />
      </div>
      <button
        className="border-0 bg-white"
        onClick={() => onDelete(row.id)}>
        <img src={deleteIcon} alt="Delete icon" className="img-fluid" />
      </button>
    </div>
  );
};

export default TimesheetRow;
