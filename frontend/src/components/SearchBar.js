import React from "react";
import PropsTypes from "prop-types";
import { FormControl, InputGroup } from "react-bootstrap";

/** Text input field for search bars */
function SearchBar(props) {
  return (
    <InputGroup>
      <FormControl
        type="text"
        placeholder={props.placeholderText}
        value={props.filterText}
        onChange={(e) => {
          props.searchFunction(e.target.value);
        }}
        className={props.className}
      />
    </InputGroup>
  );
}

SearchBar.propTypes = {
  placeholderText: PropsTypes.string,
  searchFunction: PropsTypes.func,
  /** Filter text value */
  filterText: PropsTypes.string,
  /** Additional class names */
  className: PropsTypes.string,
};

export default SearchBar;
