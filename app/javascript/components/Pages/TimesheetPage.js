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
  const [newRows, setNewRows] = useState([]);
  const [prevEntries, setPrevEntries] = useState([]);
  const [projects, setProjects] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [isDraft, setIsDraft] = useState(draft);
  const [billableError, setBillableError] = useState(null);

  const projectsURL = '/api/v1/projects';
  const timesheetsURL = '/api/v1/time_sheet_entries';

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      apiRequest(
        'GET',
        {},
        (response) => {
          setProjects(response.data);
        },
        () => {},
        projectsURL
      ),
      apiRequest(
        'GET',
        {},
        (response) => {
          const transformedEntries = response.data.map((entry) =>
            transformTimesheetEntry(entry, response.included)
          );
          setPrevEntries(transformedEntries);
          if (transformedEntries.length === 0) {
            handleAddRow();
          }
        },
        () => {},
        timesheetsURL
      ),
    ])
      .catch((error) => setFetchError(error.message))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const allRows = [...prevEntries, ...newRows];
    const totalBillableHours = calculateBillableHours(allRows, projects);
    if (totalBillableHours > 40) {
      setBillableError(
        'Billable projects may not exceed 40 hours in a work week'
      );
    } else {
      setBillableError(null);
    }
  }, [prevEntries, newRows, projects]);

  const submitTimesheetEntries = async ({
    newRows,
    prevEntries,
    projects,
    timesheetsURL,
    setIsLoading,
    setFetchError,
    setNewRows,
    setPrevEntries,
    steps,
    saveDataToDb,
    isDraft = false,
    onSuccess = () => {},
  }) => {
    setIsLoading(true);
    try {
      const newEntries = newRows.map((row) => {
        const project = projects.find(
          (p) => p.attributes.code === row.project_id
        );
        return {
          project_id: project?.id,
          total_hours: row.time,
          ...(isDraft && { draft: true }),
        };
      });

      const updatedEntries = prevEntries.map((row) => {
        const project = projects.find(
          (p) => p.attributes.code === row.project_id
        );
        return {
          id: row.id,
          project_id: project?.id,
          total_hours: row.time,
          draft: isDraft,
        };
      });

      if (newEntries.length > 0) {
        await apiRequest(
          'POST',
          { time_sheet_entries: newEntries },
          (response) => {
            if (isDraft) {
              const savedEntries = response.data.map((entry) =>
                transformTimesheetEntry(entry, projects)
              );
              setPrevEntries((prev) => [...prev, ...savedEntries]);
              setNewRows([]);
            }
          },
          () => {},
          timesheetsURL
        );
      }

      if (updatedEntries.length > 0) {
        await Promise.all(
          updatedEntries.map((entry) =>
            apiRequest(
              'PATCH',
              {
                time_sheet_entry: {
                  project_id: entry.project_id,
                  total_hours: entry.total_hours,
                  draft: entry.draft,
                },
              },
              () => {},
              () => {},
              `${timesheetsURL}/${entry.id}`
            )
          )
        );
      }

      if (!isDraft) {
        setNewRows([]);
        steps.push('causes-to-celebrate');
        saveDataToDb(steps, { draft: false });
      } else {
        saveDataToDb(steps, { draft: true });
      }

      onSuccess();
    } catch (error) {
      setFetchError(
        isDraft
          ? 'Failed to save draft.'
          : 'Failed to submit timesheet entries.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlingOnClickNext = () => {
    submitTimesheetEntries({
      newRows,
      prevEntries,
      projects,
      timesheetsURL,
      setIsLoading,
      setFetchError,
      setNewRows,
      setPrevEntries,
      steps,
      saveDataToDb,
      isDraft: false,
    });
  };

  const handleSaveDraft = () => {
    submitTimesheetEntries({
      newRows,
      prevEntries,
      projects,
      timesheetsURL,
      setIsLoading,
      setFetchError,
      setNewRows,
      setPrevEntries,
      steps,
      saveDataToDb,
      isDraft: true,
      onSuccess: () => {
        setIsDraft(true);
        document.body.click();
      },
    });
  };

  const handleAddRow = () => {
    setNewRows([
      ...newRows,
      {
        id: Date.now(),
        company: '',
        project_id: '',
        project_name: '',
        time: '',
      },
    ]);
    setIsDraft(false);
  };

  const handleOnDelete = async (id) => {
    const isNewRow = newRows.some((row) => row.id === id);

    if (isNewRow) {
      setNewRows(newRows.filter((row) => row.id !== id));
      return;
    }

    setIsLoading(true);
    try {
      await apiRequest(
        'DELETE',
        {},
        () => {
          setPrevEntries((prevEntries) =>
            prevEntries.filter((row) => row.id !== id)
          );
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
    }
  };

  const handleChangeRowData = (id, updates) => {
    const isNewRow = newRows.some((row) => row.id === id);
    if (isDraft) setIsDraft(false);
    if (isNewRow) {
      setNewRows(updateRowData(newRows, id, updates));
    } else {
      setPrevEntries(updateRowData(prevEntries, id, updates));
    }
  };

  const allRows = [...prevEntries, ...newRows];
  const isValid =
    allRows.length > 0 && allRows.every((row) => validateRow(row));
  const canSubmit =
    !isLoading && (fetchError || projects.length === 0 || isValid);
  const canAddNewRow = allRows.every((row) => validateRow(row));

  return (
    <Layout
      data={data}
      setData={setData}
      saveDataToDb={saveDataToDb}
      steps={steps}
      draft={isDraft}
      handleSaveDraft={handleSaveDraft}
    >
      <div className="container-fluid mb-1 mb-md-0">
        <div className="row flex-column justify-content-center align-items-center">
          <div className="col-12 text-center ">
            <h1 className="my-1 my-md-0">Your Timesheet</h1>
          </div>
          <div className="timesheet-form-container row justify-content-center mx-auto">
            <div className="d-flex flex-column align-content-center align-content-sm-start mb-2">
              <p className="mx-auto">Week of: </p>
              <Calendar date={timesheet_date} />
            </div>
              <div className="d-flex gap-1 mb-1 px-7">
                {allRows.map((row) => (
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
              {allRows.length > 0 && !isValid ? (
                <p>Please fill out all fields</p>
              ) : billableError ? (
                <p>{billableError}</p>
              ) : null}
            </div>

            <BtnAddNewRow onClick={handleAddRow} disabled={!canAddNewRow} />
          </div>
        </div>

        <div className="max-width-entry mx-auto mt-3">
          <BlockLowerBtns
            handlingOnClickNext={handlingOnClickNext}
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
