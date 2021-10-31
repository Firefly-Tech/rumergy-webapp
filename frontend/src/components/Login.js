import { Formik } from "formik";
import { React, useState } from "react";
import { Button, Col, Form, InputGroup, Row, Spinner } from "react-bootstrap";
import ErrorModal from "./ErrorModal";
import { FaArrowLeft } from "react-icons/fa";
import { Link, useHistory } from "react-router-dom";
import * as Yup from "yup";
import logo from "../resources/RUMergy-logos_black.png";
import { useAuth } from "../resources/use-auth";

const loginFormSchema = Yup.object().shape({
  username: Yup.string()
    .min(4, "Must be at least 4 characters")
    .max(20, "Must be less than 20 characters")
    .required("Username required")
    .matches(/^[a-zA-Z0-9]+([._]?[a-zA-Z0-9]+)*$/, "Invalid username format"),
  password: Yup.string()
    .min(8, "Must be at least 8 characters")
    .required("Password required"),
});

export default function Login() {
  const [show, setShow] = useState(false);
  const [errorName, setErrorName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const auth = useAuth();
  const history = useHistory();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSignin = async (username, password) => {
    let status = await auth.signin(username, password);
    if (status !== "OK") {
      if (status === "Unauthorized") {
        setErrorName("Invalid credentials");
        setErrorMessage("Provided credentials are invalid.");
      } else {
        setErrorName("Error");
        setErrorMessage("An error occurred. Please try again.");
      }
      return handleShow;
    } else {
      return () => history.push("/");
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    let resultAction = await handleSignin(values.username, values.password);
    setSubmitting(false);
    setLoading(false);
    resultAction();
  };

  return (
    <>
      <Row className="h-100">
        <Col sm={6} className="flex-fill p-0">
          <div className="logo-container d-flex flex-column">
            <Link
              to="/dashboard"
              className="login-back-button d-flex flex-row gap-2 align-items-center p-3 text-decoration-none fs-5"
            >
              <FaArrowLeft className="" />
              <h5 className="mb-0">Back</h5>
            </Link>
            <img
              src={logo}
              alt="Logo"
              className="login-rumergy-logo img-fluid mx-auto my-auto"
            />
          </div>
        </Col>
        <Col
          sm={6}
          className="d-flex login-form justify-content-center align-items-center"
        >
          <div className="my-auto flex-fill">
            <div className="d-flex mb-4 flex-row align-items-center gap-4">
              <h2 className="bold mb-0">Member Login</h2>
              {loading && <Spinner animation="border" variant="secondary" />}
            </div>
            <Formik
              initialValues={{ username: "", password: "" }}
              validationSchema={loginFormSchema}
              onSubmit={handleSubmit}
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
                        type="email"
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
                    <Link to="/forgot-password">Forgot password?</Link>
                    <span>|</span>
                    <Link to="/create-account">Create Account</Link>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </Col>
      </Row>
      <ErrorModal
        show={show}
        handleClose={handleClose}
        errorMessage={errorMessage}
        errorName={errorName}
      />
    </>
  );
}
