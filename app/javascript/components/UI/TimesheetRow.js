import React, { useState } from "react";
import deleteIcon from "../../../assets/images/timesheet-row-delete.svg";
import DropdownSelect from "./DropdownSelect";
import { initOpt } from "../../mockProjects"
// TODO - initOpt will be deleted after implementing data fetching from the backend.

const TimesheetRow = ({
  row,
  onDelete,
  onChangeRowData,
  data = initOpt
}) => {
  const filteredData = (() => {
    if (row.company && row.project_name) {
      // Якщо обрано і компанію, і назву проекту, фільтруємо за обома
      return data.filter(
        project =>
          project.attributes.company === row.company &&
          project.attributes.name === row.project_name
      );
    } else if (row.company) {
      // Якщо обрана лише компанія
      return data.filter(
        project => project.attributes.company === row.company
      );
    } else if (row.project_name) {
      // Якщо обрана лише назва проекту
      return data.filter(
        project => project.attributes.name === row.project_name
      );
    } else {
      // Якщо нічого не вибрано
      return data;
    }
  })();

  // const optionsCompanyNames = [...new Set(data.map(project => project.attributes.company))];
  // const projectsForSelectedCompany = row.company 
  //   ? data.filter(project => project.attributes.company === row.company)
  //   : data;
    
  const optionsCompanyNames = [...new Set(filteredData.map(project => project.attributes.company))];
  const optionsProjectIds = [...new Set(filteredData.map(project => project.attributes.code))];
  const optionsProjectNames = [...new Set(filteredData.map(project => project.attributes.name))];

  const updateProjectByKey = (searchKey, value, fieldName) => {
    const project = data.find(project => project.attributes[searchKey] === value);
    if (project) {
      onChangeRowData(row.id, {
        company: project.attributes.company,
        project_id: project.attributes.code,
        project_name: project.attributes.name
      });
    } else {
      onChangeRowData(row.id, { [fieldName]: value });
    }
  };

  const handleCompanyChange = (value) => {
    onChangeRowData(row.id, {
      company: value,
      project_id: "",
      // project_name: ""
    });
  };
  const handleProjectIdChange = (value) => {
    updateProjectByKey("code", value, "project_id");
  };
  const handleProjectNameChange = (value) => {
    onChangeRowData(row.id, { project_name: value });
  };
  const handleTimeChange = (event) => {
    const value = event.target.value;
    if (value === '' || (/^\d+$/.test(value) && parseInt(value, 10) > 0)) {
      onChangeRowData(row.id, { time: value });
    }
  };

  return (
    <div className="d-flex gap-1 flex-row flex-nowrap align-items-center">
      <div className="timesheet-row d-flex gap-1 flex-row flex-nowrap align-items-center border border-royal-blue border-4 p-1">
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
