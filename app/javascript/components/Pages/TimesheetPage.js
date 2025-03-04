import React, { useState, useEffect } from 'react';
import { rangeFormat, validateRow } from '../helpers/helpers';
import Layout from '../Layout';
import BlockLowerBtns from '../UI/BlockLowerBtns';
import { BtnAddNewRow, Calendar } from '../UI/ShareContent';
import TimesheetRow from '../UI/TimesheetRow';
import TimesheetRowHeader from '../UI/TimesheetRowHeader';
import { apiRequest } from '../requests/axios_requests';

const TimesheetPage = ({
  data,
  setData,
  saveDataToDb,
  steps,
  service,
  draft,
}) => {
  const timesheet_date = rangeFormat(data.time_period || {});
  const { isLoading, setIsLoading } = service;
  const [rows, setRows] = useState([
    {
      id: Date.now(),
      company: '',
      project_code: '',
      project_name: '',
      time: '',
    },
  ]);
  const [projects, setProjects] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const projectsURL = '/api/v1/projects';

  useEffect(() => {
    setIsLoading(true);
    apiRequest(
      'GET',
      {},
      (response) => {
        setProjects(response.data);
        setIsLoading(false);
        setFetchError(null);
      },
      () => {},
      projectsURL,
      (error) => {
        setFetchError(error.message);
        setIsLoading(false);
      }
    );
  }, []);

  const handlingOnClickNext = () => {
    steps.push('causes-to-celebrate');
    saveDataToDb(steps, { timesheet: null });
  };

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        id: Date.now(),
        company: '',
        project_code: '',
        project_name: '',
        time: '',
      },
    ]);
  };

  const handleOnDelete = (id) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleChangeRowData = (id, field, value) => {
    setRows(
      rows.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const isValid = rows.length > 0 && rows.every((row) => validateRow(row));
  const canSubmit = !isLoading && (fetchError || projects.length === 0 || isValid);

  const optionsCompanyNames = projects?.map(
    (project) => project.attributes.company
  );
  const optionsProjectCodes = projects?.map(
    (project) => project.attributes.code
  );
  const optionsProjectNames = projects?.map(
    (project) => project.attributes.name
  );

  return (
    <Layout
      data={data}
      setData={setData}
      saveDataToDb={saveDataToDb}
      steps={steps}
      draft={draft}
    >
      <div className="container-fluid">
        <div className="row flex-column justify-content-center">
          <div className="col-12 text-center mx-auto">
            <h1 className="my-1 my-md-0">Your Timesheet</h1>
          </div>
          {isLoading ? (
            <div className="text-center my-3">Loading projects...</div>
          ) : fetchError ? (
            <p className="text-danger text-center my-3">
              Error fetching projects: {fetchError}
            </p>
          ) : projects.length === 0 ? (
            <p className="text-warning text-center my-3">No projects available.</p>
          ) : (
            <div className="timesheet-form-container row justify-content-center mx-auto">
              <div className="d-flex flex-row justify-content-center justify-content-sm-start align-items-center mb-2">
                <p className="m-0 me-1">Week of: </p>
                <Calendar date={timesheet_date} />
              </div>
              <TimesheetRowHeader />
              <div className="d-flex gap-1 mb-1">
                {rows.map((row) => (
                  <TimesheetRow
                    key={row.id}
                    row={row}
                    onChangeRowData={handleChangeRowData}
                    onDelete={handleOnDelete}
                    optionsCompanyNames={optionsCompanyNames}
                    optionsProjectCodes={optionsProjectCodes}
                    optionsProjectNames={optionsProjectNames}
                  />
                ))}
              </div>
              {rows.length > 0 && (
                <p className={!isValid ? 'text-primary' : 'invisible'}>
                  Please fill out all fields
                </p>
              )}
              <BtnAddNewRow onClick={handleAddRow} />
            </div>
          )}
        </div>
        <div className="max-width-entry mx-auto mt-3">
          <BlockLowerBtns
            handlingOnClickNext={handlingOnClickNext}
            disabled={!canSubmit}
            stringBody="Submit"
            isSubmit={true}
          />
        </div>
      </div>
    </Layout>
  );
};

export default TimesheetPage;
