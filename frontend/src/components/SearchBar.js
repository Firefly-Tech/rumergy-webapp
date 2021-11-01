import React from "react";
import PropsTypes from "prop-types";
import { FloatingLabel, Form } from "react-bootstrap";

function SearchBar(props) {
  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <Form.Control
        className="dashboard-meter-item-search-bar"
        type="text"
        placeholder={props.label}
        onChange={(e) => {
          props.searchFunction(e.target.value);
        }}
      />
    </Form>
  );
}

SearchBar.propTypes = {
  label: PropsTypes.string,
  searchFunction: PropsTypes.func,
};

export default SearchBar;
