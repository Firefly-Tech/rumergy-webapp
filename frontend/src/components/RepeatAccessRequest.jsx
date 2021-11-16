import PropTypes from "prop-types";
import { Formik } from "formik";
import React, { useState } from "react";
import { Row, Col, Form, InputGroup, Button, Spinner } from "react-bootstrap";
import * as Yup from "yup";
import { useHistory } from "react-router";

const repeatAccessRequestSchema = Yup.object().shape({
  occupation: Yup.string()
    .required("Occupation required")
    .matches(/^[a-zA-Z]+$/, "Invalid format")
    .max(50, "Must be at most 50 characters."),
  justification: Yup.string()
    .required("Justification required")
    .max(200, "Must be at most 200 characters."),
});

function RepeatAccessRequest(props) {
  const [success, setSuccess] = useState(false);

  const history = useHistory();

  if (success) {
    history.push("/login/access-pending");
  }

  return (
    <>
      <Row className="mb-4">
        <Row className="mb-2">
          <Col className="d-flex flex-row align-items-center gap-4">
            <h2 className="bold mb-0">Access Request</h2>
            {props.loading && (
              <Spinner animation="border" variant="secondary" />
            )}
          </Col>
        </Row>
        <Row>
          <Col className>
            <span className="text-muted">
              {
                "You do not have access to the site. Please submit your request below."
              }
            </span>
          </Col>
        </Row>
      </Row>
      <Row>
        <Col>
          <Formik
            initialValues={{
              occupation: "",
              justification: "",
            }}
            validationSchema={repeatAccessRequestSchema}
            onSubmit={async (values, handlers) => {
              setSuccess(await props.handleSubmit(values, handlers));
            }}
          >
            {(formik) => (
              <Form
                className="d-flex flex-column flex-fill"
                onSubmit={formik.handleSubmit}
                noValidate
              >
                <Row className="mb-3">
                  <Form.Group as={Col}>
                    <Form.Label>Occupation</Form.Label>
                    <InputGroup hasValidation>
                      <Form.Control
                        id="occupation"
                        placeholder="Occupation"
                        isInvalid={!!formik.errors.occupation}
                        {...formik.getFieldProps("occupation")}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.occupation}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                </Row>
                <Row className="mb-4">
                  <Form.Label className="mb-0">Justification</Form.Label>
                  <Form.Text className="mb-2" muted>
                    Provide a justification for your access request. 200
                    characters maximum.
                  </Form.Text>
                  <InputGroup hasValidation>
                    <Form.Control
                      id="justification"
                      as="textarea"
                      placeholder="Justification"
                      style={{ height: "100px" }}
                      isInvalid={!!formik.errors.justification}
                      {...formik.getFieldProps("justification")}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.justification}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Row>
                <Row>
                  <Col className="d-flex justify-content-center">
                    <Button
                      className="flex-fill"
                      type="submit"
                      variant="primary"
                    >
                      Submit
                    </Button>
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>
        </Col>
      </Row>
    </>
  );
}

RepeatAccessRequest.propTypes = {
  loading: PropTypes.bool,
  handleSubmit: PropTypes.func,
};

export default RepeatAccessRequest;
