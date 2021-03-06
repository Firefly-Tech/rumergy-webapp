import { Formik } from "formik";
import React from "react";
import PropTypes from "prop-types";
import { Button, Form, InputGroup, Spinner, Row, Col } from "react-bootstrap";
import { Link, useRouteMatch } from "react-router-dom";
import * as Yup from "yup";

/**
 * Yup validation schema for login form
 *
 * @constant {object} loginFormSchema
 * */
const loginFormSchema = Yup.object().shape({
  username: Yup.string().required("Username required"),
  password: Yup.string().required("Password required"),
});

/** Form for user login */
export default function LoginForm(props) {
  const { path } = useRouteMatch();

  return (
    <>
      <Row className="mb-4">
        <Col className="d-flex flex-row align-items-center gap-4">
          <h2 className="bold mb-0">Member Login</h2>
          {props.loading && <Spinner animation="border" variant="secondary" />}
        </Col>
      </Row>
      <Row>
        <Col>
          <Formik
            initialValues={{ username: "", password: "" }}
            validationSchema={loginFormSchema}
            onSubmit={props.handleSubmit}
          >
            {(formik) => (
              <Form
                className="d-flex flex-column flex-fill"
                onSubmit={formik.handleSubmit}
                noValidate
              >
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      id="username"
                      placeholder="Enter username"
                      isInvalid={!!formik.errors.username}
                      {...formik.getFieldProps("username")}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.username}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      id="password"
                      type="password"
                      placeholder="Password"
                      isInvalid={!!formik.errors.password}
                      {...formik.getFieldProps("password")}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.password}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={formik.isSubmitting}
                >
                  Login
                </Button>
                <div className="login-page-links d-flex flex-row justify-content-center align-items-center mt-2 gap-2">
                  <Link to={`${path}/forgot-password`}>Forgot password?</Link>
                  <span>|</span>
                  <Link to={`${path}/create-account`}>Create Account</Link>
                </div>
              </Form>
            )}
          </Formik>
        </Col>
      </Row>
    </>
  );
}

LoginForm.propTypes = {
  loading: PropTypes.bool,
  /** Handle login submit */
  handleSubmit: PropTypes.func,
};
