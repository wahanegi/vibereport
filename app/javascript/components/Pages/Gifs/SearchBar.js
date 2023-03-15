import React from "react"
import Form from 'react-bootstrap/Form';

const SearchBar = ({ setTerm, term }) => {
  const onInputChange = (input) => {
    setTerm(input);
  }

  return <div className="card-header">
    <Form.Control type="text"
                  placeholder="Search GIPHY"
                  onChange={event => onInputChange(event.target.value)}
                  value={term} />
  </div>
}

export default SearchBar
