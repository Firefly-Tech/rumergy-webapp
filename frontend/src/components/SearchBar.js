import React from "react";
import PropsTypes from "prop-types";
import { Form } from "react-bootstrap";

function SearchBar(props) {
  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <Form.Control
        type="text"
        placeholder={props.label}
        onChange={(e) => {
          props.searchFunction(e.target.value);
        }}
        className={props.className}
      />
    </Form>
  );
}

SearchBar.propTypes = {
  label: PropsTypes.string,
  searchFunction: PropsTypes.func,
  className: PropsTypes.string,
};

export default SearchBar;
