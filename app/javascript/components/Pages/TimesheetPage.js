import React, { useEffect, useState } from 'react';
import {
  calculateBillableHours,
  rangeFormat,
  transformTimesheetEntry,
  updateRowData,
  validateRow,
} from '../helpers/helpers';
import Layout from '../Layout';
import { apiRequest } from '../requests/axios_requests';
import BlockLowerBtns from '../UI/BlockLowerBtns';
import { BtnAddNewRow, Calendar } from '../UI/ShareContent';
import TimesheetRow from '../UI/TimesheetRow';

const TimesheetPage = ({ data, setData, saveDataToDb, steps, service }) => {
  
  const timesheetDate = rangeFormat(data.time_period || {});
  const { isLoading, setIsLoading } = service;
  const [rowsData, setRowsData] = useState([]);
  const [projects, setProjects] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [isDraft, setIsDraft] = useState(true);
  const [billableError, setBillableError] = useState(null);

  const projectsURL = '/api/v1/projects';
  const timesheetsURL = '/api/v1/time_sheet_entries';
  const upsertURL = '/api/v1/time_sheet_entries/upsert';

  // Fetch projects and timesheet entries on component mount
  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      apiRequest('GET', {}, (response) => { setProjects(response.data);}, () => {}, projectsURL),
      apiRequest('GET', {}, (response) => {
        const transformedEntries = response.data.map((entry) =>
          transformTimesheetEntry(entry, response.included)
        );
        setRowsData(transformedEntries);
        if (transformedEntries.length === 0) {
          handleAddRow();
        }
      }, () => {}, timesheetsURL),
    ]).catch((error) => setFetchError(error.message))
      .finally(() => setIsLoading(false));
  }, []);

  // Validate billable hours whenever rowsData or projects change
  useEffect(() => {
    const totalBillableHours = calculateBillableHours(rowsData, projects);
    if (totalBillableHours > 40) {
      setBillableError(
        'Billable projects may not exceed 40 hours in a work week'
      );
    } else {
      setBillableError(null);
    }
  }, [rowsData, projects]);

  // Function to submit the timesheet
  const submitTimesheet = (isDraft = false, onSuccess = () => {}) => {
    const formattedEntries = rowsData.map((row) => ({
      id: String(row.id).startsWith('new_') ? undefined : row.id,
      project_id: row.project_id,
      total_hours: row.time,
    }));

    const payload = {
      time_sheet_entries: formattedEntries,
    };
    
    apiRequest('POST', payload, (responseData) => {
        setRowsData(responseData.data.map((entry) =>
            transformTimesheetEntry(entry, responseData.included)
        ));
      }, () => {}, upsertURL,
      (error) => {console.error('Upsert failed:', error);}
    );

    if (!isDraft) {
      steps.push('causes-to-celebrate');
      saveDataToDb(steps, { draft: false });
    } else {

      saveDataToDb(steps, { draft: true });
    }
    onSuccess();
  };

  const saveDraft = () => {
    submitTimesheet(true, () => {
      setIsDraft(true);
      document.body.click();
    });
  };

  const handleAddRow = () => {
    setRowsData([
      ...rowsData,
      {
        id: `new_${Date.now()}`,
        company: '',
        project_id: '',
        project_name: '',
        time: '',
      },
    ]);
    setIsDraft(false);
  };

  const handleOnDelete = async (id) => {
    const isNewRow = String(id).startsWith('new_');

    if (isNewRow) {
      setRowsData(rowsData.filter((row) => row.id !== id));
      return;
    }

    setIsLoading(true);
    try {
      await apiRequest(
        'DELETE',
        {},
        () => {
          setRowsData((prevRows) => prevRows.filter((row) => row.id !== id));
        },
        () => {},
        `${timesheetsURL}/${id}`,
        (error) => {
          setFetchError(`Failed to delete timesheet entry: ${error.message}`);
        }
      );
    } catch (error) {
      setFetchError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
      setIsDraft(false);
    }
  };

  const handleChangeRowData = (id, updates) => {
    if (isDraft) setIsDraft(false);
    setRowsData(updateRowData(rowsData, id, updates));
  };

  const isValid = rowsData.length > 0 && rowsData.every((row) => validateRow(row));
  const canSubmit = !isLoading && isValid && !fetchError && projects.length > 0;
  const canAddNewRow = rowsData.every((row) => validateRow(row));

  return (
    <Layout
      data={data}
      setData={setData}
      saveDataToDb={saveDataToDb}
      steps={steps}
      draft={isDraft}
      handleSaveDraft={saveDraft}
    >
      <div className="container-fluid mb-1 mb-md-0">
        <div className="row flex-column justify-content-center align-items-center">
          <div className="col-12 text-center ">
            <h1 className="my-1 my-md-0">Your Timesheet</h1>
          </div>
          <div className="timesheet-form-container row justify-content-center mx-auto">
            <div className="d-flex flex-column align-content-center align-content-sm-start mb-2">
              <p className="mx-auto">Week of: </p>
              <Calendar date={timesheetDate} />
            </div>
            <div className="d-flex gap-1 mb-1 px-7">
              {rowsData.map((row) => (
                <TimesheetRow
                  key={row.id}
                  row={row}
                  onChangeRowData={handleChangeRowData}
                  onDelete={handleOnDelete}
                  projects={projects}
                />
              ))}
            </div>
            <div style={{ height: '20px' }} className="text-primary">
              {rowsData.length > 0 && !isValid ? (
                <p>Please fill out all fields</p>
              ) : billableError ? (
                <p>{billableError}</p>
              ) : null}
            </div>

            <BtnAddNewRow
              onClick={handleAddRow}
              disabled={!canAddNewRow || billableError}
            />
          </div>
        </div>

        <div className="max-width-entry mx-auto mt-3">
          <BlockLowerBtns
            handlingOnClickNext={() => submitTimesheet()}
            disabled={!canSubmit || billableError}
            stringBody="Submit"
            isSubmit={true}
          />
        </div>
      </div>
    </Layout>
  );
};

export default TimesheetPage;
