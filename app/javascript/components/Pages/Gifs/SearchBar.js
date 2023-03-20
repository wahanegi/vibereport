import React, {useEffect, useState} from "react"
import Form from 'react-bootstrap/Form';

const SearchBar = ({ setTerm, term, category, word }) => {
  const [classInput, setClassInput] = useState(category)
  const onInputChange = (input) => {
    setTerm(input);
  }

  useEffect(() => {
    if (term !== word) {
      setClassInput('other')
    } else {
      setClassInput(category)
    }
  },[term])

  return <div className="card-header">
    <Form.Control type="text"
                  className={`${classInput}-input`}
                  placeholder="Search GIPHY"
                  onChange={e => onInputChange(e.target.value)}
                  value={term} />
  </div>
}

export default SearchBar
