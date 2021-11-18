import React, { useState } from "react";
import PropTypes from "prop-types";
import { Modal, Row, Col, Button, Form, InputGroup } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import { roles } from "../resources/constants";
import { FaPlus, FaExclamation, FaCheck } from "react-icons/fa";

const { General, ...userRoles } = roles;

/**
 * Yup validation schema for user add form.
 *
 * @constant {object} userAddFormSchema
 * */
const userAddFormSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(1, "Must be at least 1 character")
    .max(50, "Must be at most 50 characters")
    .required("First name is required")
    .matches(/\b([A-ZÀ-ÿ][-,a-z. ']+[ ]*)+/, "Invalid format"),
  lastName: Yup.string()
    .min(1, "Must be at least 1 character")
    .max(50, "Must be at most 50 characters")
    .required("Last name is required")
    .matches(/\b([A-ZÀ-ÿ][-,a-z. ']+[ ]*)+/, "Invalid format"),
  username: Yup.string()
    .min(4, "Must be at least 4 characters")
    .max(20, "Must be less than 20 characters")
    .required("Username required")
    .matches(/^[a-zA-Z0-9]+([._]?[a-zA-Z0-9]+)*$/, "Invalid username format"),
  email: Yup.string().email("Invalid email format").required("Email required"),
  password: Yup.string()
    .min(8, "Must be at least 8 characters")
    .max(20, "Must be at most 20 characters long")
    .required("Password required")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]/,
      "Password does not meet requirements"
    ),
  role: Yup.string().required("Role required").oneOf(Object.values(userRoles)),
});

/** Modal for user creation in user management dashboard */
function UserAddModal(props) {
  const [isConfirm, setIsConfirm] = useState(false);

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  /**
   * Resets all state.
   *
   * @function resetAll
   * */
  const resetAll = () => {
    setIsConfirm(false);
    setSuccess(false);
    setError(false);
  };

  return (
    <Modal
      centered
      size="lg"
      show={props.show}
      onHide={() => {
        props.handleClose();
        resetAll();
      }}
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <h4 className="bold">Add Entry</h4>
        </Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          email: "",
          role: "",
          username: "",
          password: "",
        }}
        validationSchema={userAddFormSchema}
        onSubmit={async (values, handlers) => {
          let status = await props.handleSubmit(values, handlers);
          if (status) setSuccess(true);
          else setError(true);
        }}
      >
        {(formik) => (
          <>
            <Form
              onSubmit={formik.handleSubmit}
              noValidate
              className="d-flex flex-column"
            >
              <Modal.Body>
                <Form.Group className="mb-3">
                  <Form.Label>First Name</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      id="firstName"
                      placeholder="Enter first name"
                      isInvalid={!!formik.errors.firstName}
                      {...formik.getFieldProps("firstName")}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.firstName}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Last Name</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      id="lastName"
                      placeholder="Enter last name"
                      isInvalid={!!formik.errors.lastName}
                      {...formik.getFieldProps("lastName")}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.lastName}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Role</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Select
                      id="role"
                      placeholder="Select role"
                      isInvalid={!!formik.errors.role}
                      {...formik.getFieldProps("role")}
                    >
                      {Object.keys(userRoles).map((key, index) => (
                        <option key={index} value={userRoles[key]}>
                          {key}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.role}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
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
                  <Form.Label>Email</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      id="email"
                      placeholder="Enter email"
                      isInvalid={!!formik.errors.email}
                      {...formik.getFieldProps("email")}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.email}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      id="password"
                      placeholder="Enter password"
                      type="password"
                      isInvalid={!!formik.errors.password}
                      {...formik.getFieldProps("password")}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.password}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Modal.Body>
              <Modal.Footer className="d-flex flex-column">
                {success || error ? (
                  <Row>
                    <Col className="d-flex flex-column align-items-center">
                      {success ? (
                        <>
                          <FaCheck />
                          Operation was successful
                        </>
                      ) : (
                        <>
                          <Row className="mb-2">
                            <Col className="d-flex flex-row gap-2 align-items-center">
                              <FaExclamation />
                              An error occured. Please try again.
                            </Col>
                          </Row>
                          <Row>
                            <Col>
                              <Button
                                variant="primary"
                                onClick={(e) => {
                                  e.preventDefault();
                                  resetAll();
                                }}
                              >
                                Try again
                              </Button>
                            </Col>
                          </Row>
                        </>
                      )}
                    </Col>
                  </Row>
                ) : (
                  <>
                    {isConfirm ? (
                      <Row className="mb-3">
                        <Col>{"Are you sure you wish to add this entry?"}</Col>
                      </Row>
                    ) : null}
                    <Row>
                      <Col className="d-flex flex-row gap-4 justify-content-center align-items-center mx-auto">
                        {isConfirm ? (
                          <>
                            <Button
                              type="submit"
                              variant="primary"
                              className={
                                "d-flex flex-row align-items-center gap-2"
                              }
                            >
                              <FaPlus />
                              Add
                            </Button>
                            <Button
                              variant="secondary"
                              className="d-flex flex-row align-items-center gap-2 text-white"
                              onClick={(e) => {
                                e.preventDefault();
                                setIsConfirm(false);
                              }}
                            >
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="primary"
                              className="d-flex flex-row align-items-center gap-2"
                              onClick={(e) => {
                                e.preventDefault();
                                setIsConfirm(true);
                              }}
                            >
                              <FaPlus />
                              Add
                            </Button>
                          </>
                        )}
                      </Col>
                    </Row>
                  </>
                )}
              </Modal.Footer>
            </Form>
          </>
        )}
      </Formik>
    </Modal>
  );
}

UserAddModal.propTypes = {
  /** Determines whether modal should be shown */
  show: PropTypes.bool,
  handleClose: PropTypes.func,
  /** Submission handler */
  handleSubmit: PropTypes.func,
};

export default UserAddModal;
