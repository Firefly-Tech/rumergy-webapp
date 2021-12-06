import { React, useState } from "react";
import PropTypes from "prop-types";
import { Row, Col, Card, Form } from "react-bootstrap";

function DLSTimeInterval(props) {
  const [customInterval, setCustomInterval] = useState(false);

  const chooseInterval = () => {};

  return (
    <Card className="DLS-card mb-sm-3 flex-fill">
      <Card.Title className="d-flex flex-row align-self-start px-3 pt-2">
        <h4 className="bold mb-0">Time Interval</h4>
      </Card.Title>
      <Card.Body className="building-content">
       
            <Form.Check
               type="radio"
               label="Real Time"
               name="formHorizontalRadios"
               id="formHorizontalRadios1"
            />
            <Form.Check
               type="radio"
               label="Custom"
               name="formHorizontalRadios"
               id="formHorizontalRadios2"
              //onClick={() => chooseInterval()}
            />
            <Form.Control
              //style = "width: 30px"
              className="d-flex "
              size="sm"
              type={"number"}
            />
         
      </Card.Body>
    </Card>
  );
}

export default DLSTimeInterval;

