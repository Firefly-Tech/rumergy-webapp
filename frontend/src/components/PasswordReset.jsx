import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Formik } from "formik";
import { useSearch } from "../resources/use-query";
import * as Yup from "yup";
import { Row, Col, Spinner, Button, Form, InputGroup } from "react-bootstrap";
import { useHistory } from "react-router";

const passwordResetSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, "Must be at least 8 characters")
    .max(20, "Must be at most 20 characters long")
    .required("Password required")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]/,
      "Password does not meet requirements"
    ),
  passwordConfirmation: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Password confirmation required"),
});

function PasswordReset(props) {
  const [token, setToken] = useState(null);
  const [success, setSuccess] = useState(false);

  const query = useSearch();
  const history = useHistory();

  // Get token and validate
  useEffect(async () => {
    let token = query.get("token");
    if (token) {
      setToken(await props.verifyToken(token));
    }
  }, [token]);

  if (success) {
    return (
      <>
        <Row>
          <Col className="d-flex flex-column justify-content-center text-center">
            <h2 className="bold">Password reset successful</h2>
            <span className="text-muted mb-4">
              Your password has been changed successfully.
            </span>
            <Button
              variant="primary"
              onClick={() => {
                history.push("/login");
              }}
            >
              Login
            </Button>
          </Col>
        </Row>
      </>
    );
  }

  if (!props.loading && !token) {
    return (
      <>
        <Row>
          <Col className="d-flex flex-column justify-content-center text-center">
            <h2 className="bold">Invalid password reset token</h2>
            <span className="text-muted mb-4">
              The password reset link has either expired or is invalid. Please
              try resetting your password again.
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

  // TODO: Validate token on entry
  return (
    <>
      <Row className="mb-4">
        <Row className="mb-2">
          <Col className="d-flex flex-row align-items-center gap-4">
            <h2 className="bold mb-0">Password Reset</h2>
            {props.loading && (
              <Spinner animation="border" variant="secondary" />
            )}
          </Col>
        </Row>
        <Row>
          <Col className>
            <span className="text-muted">
              {"Reset your account's password"}
            </span>
          </Col>
        </Row>
      </Row>
      <Row>
        <Col>
          <Formik
            initialValues={{
              password: "",
              passwordConfirmation: "",
            }}
            validationSchema={passwordResetSchema}
            onSubmit={async (values, helpers) => {
              setSuccess(await props.handleSubmit(token, values, helpers));
            }}
          >
            {(formik) => (
              <Form
                className="d-flex flex-column flex-fill"
                onSubmit={formik.handleSubmit}
                noValidate
              >
                <Form.Group className="mb-4">
                  <Form.Label>New Password</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      id="password"
                      placeholder="New password"
                      type="password"
                      isInvalid={!!formik.errors.password}
                      {...formik.getFieldProps("password")}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.password}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label>Confirm Password</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      id="passwordConfirmation"
                      placeholder="Confirm password"
                      type="password"
                      isInvalid={!!formik.errors.passwordConfirmation}
                      {...formik.getFieldProps("passwordConfirmation")}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.passwordConfirmation}
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

PasswordReset.propTypes = {
  loading: PropTypes.bool,
  handleSubmit: PropTypes.func,
  verifyToken: PropTypes.func,
};

export default PasswordReset;
