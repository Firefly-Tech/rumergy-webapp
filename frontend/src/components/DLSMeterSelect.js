import { React, useState } from "react";
import PropTypes from "prop-types";
import { Row, Col, Card, Form } from "react-bootstrap";
import DLSBuildingSelect from "./DLSBuidingSelect";

function DLSMeterSelect(props) {
  const selectAvailable = () => {
    // if()){
    // }
  };

  return (
    <Card className="DLS-card mb-sm-3 flex-row">
      <Card.Title className="d-flex flex-row align-self-center px-3 pt-2">
        <h4 className="bold mb-0">Meter</h4>
      </Card.Title>
      <Card.Body className="building-content">
        <Form.Select
          id="meterSelect"
          aria-label="Default select"
          disabled={false}
        >
          <option>Choose Meter</option>
          <option value="1">Model 1</option>
          <option value="2">Model 2</option>
          <option value="3">Model 3</option>
        </Form.Select>
      </Card.Body>
    </Card>
  );
}

export default DLSMeterSelect;
