import React from "react";
import { Row, Col, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";

/** Access pending message */
function AccessPending() {
  const history = useHistory();
  return (
    <>
      <Row>
        <Col className="d-flex flex-column justify-content-center text-center">
          <h2 className="bold">Request sent</h2>
          <span className="text-muted mb-4">
            Your access to the site is pending approval.
          </span>
          <Button
            variant="primary"
            onClick={() => {
              history.push("/dashboard");
            }}
          >
            Back to dashboard
          </Button>
        </Col>
      </Row>
    </>
  );
}

export default AccessPending;
