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
        <Form>
          <Form.Group>
            <Form.Check
              type={"radio"}
              name="real-time"
              value={3}
              id="real-time"
              label={`Real Time`}
            />
            <Form.Check
              type={"radio"}
              value="custom"
              name="custom"
              id="custom"
              label={`Custom`}
              onClick={() => chooseInterval()}
            />
            <Form.Control
              //style = "width: 30px"
              className="d-flex "
              size="sm"
              type={"number"}
            />
          </Form.Group>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default DLSTimeInterval;

