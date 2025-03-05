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
  const [rows, setRows] = useState([]);
  const [projects, setProjects] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  
  const projectsURL = '/api/v1/projects';
  const timesheetsURL = '/api/v1/time_sheet_entries';
  
  const handleAddRow = () => {
    setRows((prevRows) => [
      ...prevRows,
      {
        id: Date.now(),
        company: '',
        project_id: '',
        project_name: '',
        time: '',
      },
    ]);
  };

  useEffect(() => {
    setIsLoading(true);
    apiRequest(
      'GET',
      {},
      (response) => {
        setProjects(response.data);
      },
      () => {},
      projectsURL,
      (error) => {
        setFetchError(error.message);
        setIsLoading(false);
      }
    );

    apiRequest(
      'GET',
      {},
      (response) => {
        const transformedEntries = response.data.map((entry) => {
          const project = response.included.find(
            (inc) => inc.id === entry.relationships.project.data.id
          );
          return {
            id: entry.id,
            company: project?.attributes.company || '',
            project_id: project?.attributes.code || '',
            project_name: project?.attributes.name || '',
            time: entry.attributes.total_hours.toString(),
          };
        });

        if (transformedEntries.length === 0) {
          // Якщо записів немає, додаємо один пустий рядок через handleAddRow
          handleAddRow();
        } else {
        setRows(transformedEntries);
        }
        setIsLoading(false);
        setFetchError(null);
      },
      () => {},
      timesheetsURL,
      (error) => {
        setFetchError(error.message);
        setIsLoading(false);
      }
    );
  }, []);

  const handlingOnClickNext = () => {
    steps.push('causes-to-celebrate');
    saveDataToDb(steps, { timesheet: null });
    // TODO Add logic to save new rows to the database
  };


  const handleOnDelete = async (id) => {
    const isNewRow = newRows.some((row) => row.id === id);

    if (isNewRow) {
      setNewRows(newRows.filter((row) => row.id !== id));
      return;
    }

    try {
      setIsLoading(true);
      await apiRequest(
        'DELETE',
        {},
        () => {
          setPrevEntries(prevEntries.filter((row) => row.id !== id));
          setIsLoading(false);
        },
        () => {},
        `${timesheetsURL}/${id}`,
        (error) => {
          setFetchError(`Failed to delete timesheet entry: ${error.message}`);
          setIsLoading(false);
        }
      );
    } catch (error) {
      setFetchError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const handleChangeRowData = (id, updates) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === id ? { ...row, ...updates } : row
      )
    );
  };

  const isValid = rows.length > 0 && rows.every((row) => validateRow(row));
  const canSubmit = !isLoading && !fetchError && projects.length > 0 && isValid;
  const canAddNewRow = rows.every((row) => validateRow(row));

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
            <div className="text-center my-3">Loading timesheet data...</div>
          ) : fetchError ? (
            <p className="text-danger text-center my-3">Error: {fetchError}</p>
          ) : projects.length === 0 ? (
            <p className="text-warning text-center my-3">
              No projects available.
            </p>
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
                    projects={projects}
                  />
                ))}
              </div>
              {rows.length > 0 && (
                <p className={!isValid ? 'text-primary' : 'invisible'}>
                  Please fill out all fields
                </p>
              )}
              <BtnAddNewRow onClick={handleAddRow} disabled={!canAddNewRow} />
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
