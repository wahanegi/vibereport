import React from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';

const DropdownSelect = ({
    id,
    options,  // Array of selectable options for the dropdown
    selected, // Currently selected value
    onChange, // Function to handle selection changes, receives an array of selected values
    disabled,
    isLoading,
    placeholder= "Select an option..." }) => {

  return (
    <div className="dropdown-container">
      <Typeahead
        id={id}
        options={options}
        selected={selected}
        onChange={(selected) => onChange(selected[0] || null)}
        placeholder={placeholder}
        disabled={disabled}
        isLoading={isLoading}
        clearButton
      />
    </div>
  );
};

export default DropdownSelect;