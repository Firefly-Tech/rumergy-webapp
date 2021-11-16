import { React, useState } from "react";
import PropTypes from "prop-types";
import { Row, Col, Card, Form } from "react-bootstrap";
import DLSMeterSelect from "./DLSMeterSelect";

function DLSBuildingSelect(props) {
  return (
    <Card className="DLS-card mb-sm-3 flex-row flex-fill">
      <Card.Title className="d-flex flex-row align-self-center px-3 pt-2">
        <h4 className="bold mb-0">Building</h4>
      </Card.Title>
      <Card.Body className="building-content">
        <Form.Select aria-label="Default select">
          <option>Choose Building</option>
          <option value="1">Chardon</option>
          <option value="2">Biology</option>
          <option value="3">Stefani</option>
        </Form.Select>
      </Card.Body>
    </Card>
  );
}

export default DLSBuildingSelect;
