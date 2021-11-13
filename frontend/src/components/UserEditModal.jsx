import React, { useState } from "react";
import PropTypes from "prop-types";
import { Modal, Row, Col, Button, Form, InputGroup } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import { roles } from "../resources/constants";
import { FaSync, FaTrash, FaExclamation, FaCheck } from "react-icons/fa";

const { General, ...userRoles } = roles;

const userEditFormSchema = Yup.object().shape({
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
  email: Yup.string().email("Invalid email format").required("Email required"),
  role: Yup.string().required("Role required").oneOf(Object.values(userRoles)),
});

function UserEditModal(props) {
  const [isUpdate, setIsUpdate] = useState(false);
  const [isDelete, setIsDelete] = useState(false);

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const resetAll = () => {
    setIsUpdate(false);
    setIsDelete(false);
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
          <h4 className="bold">Edit Entry</h4>
        </Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={{
          firstName: props.selectedEditEntry.profile.first_name,
          lastName: props.selectedEditEntry.profile.last_name,
          email: props.selectedEditEntry.email,
          role: props.selectedEditEntry.profile.role,
        }}
        validationSchema={userEditFormSchema}
        onSubmit={async (values, handlers) => {
          let status;
          if (isUpdate) {
            status = await props.handleEdit(
              props.selectedEditEntry.id,
              values,
              handlers
            );
          } else {
            status = await props.handleDelete(
              props.selectedEditEntry.id,
              handlers
            );
          }
          if (status) setSuccess(true);
          else setError(true);
        }}
        enableReinitialize
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
                    {isUpdate || isDelete ? (
                      <Row className="mb-3">
                        <Col>
                          {`Are you sure you wish to ${
                            isUpdate ? "update" : "delete"
                          } this entry?`}
                        </Col>
                      </Row>
                    ) : null}
                    <Row>
                      <Col className="d-flex flex-row gap-4 justify-content-center align-items-center mx-auto">
                        {isUpdate || isDelete ? (
                          <>
                            <Button
                              type="submit"
                              variant={isUpdate ? "primary" : "danger"}
                              className={`d-flex flex-row align-items-center gap-2 ${
                                isDelete ? "text-white" : ""
                              }`}
                            >
                              {isUpdate ? (
                                <>
                                  <FaSync />
                                  Update
                                </>
                              ) : (
                                <>
                                  <FaTrash />
                                  Delete
                                </>
                              )}
                            </Button>
                            <Button
                              variant="secondary"
                              className="d-flex flex-row align-items-center gap-2 text-white"
                              onClick={(e) => {
                                e.preventDefault();
                                setIsUpdate(false);
                                setIsDelete(false);
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
                                setIsUpdate(true);
                              }}
                            >
                              <FaSync />
                              Update
                            </Button>
                            <Button
                              variant="danger"
                              className="d-flex flex-row align-items-center gap-2 text-white"
                              onClick={(e) => {
                                e.preventDefault();
                                setIsDelete(true);
                              }}
                            >
                              <FaTrash />
                              Delete
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

UserEditModal.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
  selectedEditEntry: PropTypes.object,
  handleEdit: PropTypes.func,
  handleDelete: PropTypes.func,
};

export default UserEditModal;
