import React, { useState } from "react";
import PropTypes from "prop-types";
import { Formik } from "formik";
import { Form, Row, Col, InputGroup, Spinner, Button } from "react-bootstrap";
import * as Yup from "yup";
import { useHistory } from "react-router";

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email format").required("Email required"),
});

function ForgotPassword(props) {
  const [success, setSuccess] = useState(false);

  const history = useHistory();

  if (success) {
    return (
      <>
        <Row>
          <Col className="d-flex flex-column justify-content-center text-center">
            <h2 className="bold">Password reset sent</h2>
            <span className="text-muted mb-4">
              If the given email matches an existing account, then an email
              containing instructions on how to proceed was sent.
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

  return (
    <>
      <Row className="mb-4">
        <Row className="mb-2">
          <Col className="d-flex flex-row align-items-center gap-4">
            <h2 className="bold mb-0">Forgot Password</h2>
            {props.loading && (
              <Spinner animation="border" variant="secondary" />
            )}
          </Col>
        </Row>
        <Row>
          <Col className>
            <span className="text-muted">{"Request a password reset"}</span>
          </Col>
        </Row>
      </Row>
      <Row>
        <Col>
          <Formik
            initialValues={{
              email: "",
            }}
            validationSchema={forgotPasswordSchema}
            onSubmit={async (values, helpers) => {
              setSuccess(await props.handleSubmit(values, helpers));
            }}
          >
            {(formik) => (
              <Form
                className="d-flex flex-column flex-fill"
                onSubmit={formik.handleSubmit}
                noValidate
              >
                <Form.Group className="mb-4">
                  <Form.Label>Email</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      id="email"
                      placeholder="Email"
                      isInvalid={!!formik.errors.email}
                      {...formik.getFieldProps("email")}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.email}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={formik.isSubmitting}
                >
                  Submit
                </Button>
              </Form>
            )}
          </Formik>
        </Col>
      </Row>
    </>
  );
}

ForgotPassword.propTypes = {
  loading: PropTypes.bool,
  handleSubmit: PropTypes.func,
};

export default ForgotPassword;
