import React from 'react';
import {Typeahead} from 'react-bootstrap-typeahead';

const DropdownSelect = ({
                          id,
                          options,  // Array of selectable options for the dropdown
                          selected, // Currently selected value
                          onChange, // Function to handle selection changes, receives an array of selected values
                          disabled,
                          isLoading,
                          placeholder = "Select...",
                          className
                        }) => {

  return (
    <div className={`dropdown-container ${className}`}>
      <Typeahead
        id={id}
        options={options}
        selected={selected ? [selected] : []}
        onChange={(selected) => onChange(selected[0] || null)}
        placeholder={placeholder}
        disabled={disabled}
        isLoading={isLoading}
        clearButton
        inputProps={{
            autoComplete: 'off',
            autoCorrect: 'off',
            spellCheck: 'false',
            inputMode: 'text',
            name: `${id}-${Date.now()}` //unique name to avoid cache in the browser
        }}
      />
    </div>
  );
};

export default DropdownSelect;