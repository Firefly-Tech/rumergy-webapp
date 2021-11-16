import React from "react";
import PropsTypes from "prop-types";
import { FormControl, InputGroup } from "react-bootstrap";

function SearchBar(props) {
  return (
    <InputGroup>
      <FormControl
        type="text"
        placeholder={props.label}
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
  label: PropsTypes.string,
  searchFunction: PropsTypes.func,
  filterText: PropsTypes.string,
  className: PropsTypes.string,
};

export default SearchBar;
