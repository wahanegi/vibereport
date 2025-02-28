import React, {useState} from 'react';
import {rangeFormat} from "../helpers/helpers";
import {validateRow} from "../helpers/helpers";
import Layout from "../Layout";
import BlockLowerBtns from "../UI/BlockLowerBtns";
import {BtnAddNewRow, Calendar} from "../UI/ShareContent";
import TimesheetRow from "../UI/TimesheetRow";
import TimesheetRowHeader from "../UI/TimesheetRowHeader";

const TimesheetPage = ({
                         data,
                         setData,
                         saveDataToDb,
                         steps,
                         service,
                         draft,
                       }) => {
  const timesheet_date = rangeFormat(data.time_period || {})

  const {isLoading, error} = service;
  const [rows, setRows] = useState([{id: Date.now(), company: "", project_id: "", project_name: "", time: ""}])

  const handlingOnClickNext = () => {
    steps.push('causes-to-celebrate');
    saveDataToDb(steps, {timesheet: null});
  }

  const handleAddRow = () => {
    setRows([...rows, {id: Date.now(), company: "", project_id: "", project_name: "", time: ""}]);
  }

  const handleOnDelete = (id) => {
    setRows(rows.filter(row => row.id !== id))
  }

  const handleChangeRowData = (id, field, value) => {
    setRows(rows.map(row =>
      row.id === id
        ? {...row, [field]: value} : row
    ))
  }

  const isValid = rows.length > 0 && rows.every((row) => validateRow(row));

  return (
    !isLoading && (
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

            {/*Calendar*/}
            <div className={"d-flex flex-row justify-content-center justify-content-sm-start align-items-center mb-2"}>
              <p className={"m-0 me-1"}>Week of: </p>
              <Calendar date={timesheet_date}/>
            </div>

            {/* Timesheet header, rows & btn-add*/}
            <TimesheetRowHeader/>
            <div className={"d-flex gap-1 mb-1"}>
              {rows.map((row) => (
                <TimesheetRow
                  key={row.id}
                  row={row}
                  onChangeRowData={handleChangeRowData}
                  onDelete={handleOnDelete}
                />
              ))}
            </div>
            {rows.length > 0 && <p className={!isValid ? "text-primary" : "invisible"}>
              Please fill up all fields
            </p>}
            <BtnAddNewRow onClick={handleAddRow}/>
          </div>

          <div className="max-width-entry mx-auto">
            <BlockLowerBtns
              handlingOnClickNext={handlingOnClickNext}
              disabled={!isValid}
              stringBody="Submit"
              isSubmit={true}
            />
          </div>
        </div>
      </Layout>
    )
  );
};

export default TimesheetPage;
