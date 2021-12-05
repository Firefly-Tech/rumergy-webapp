import React, { useState } from "react";
import PropTypes from "prop-types";
import { Modal, Row, Col, Button, Form, InputGroup } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import { FaPlus, FaExclamation, FaCheck } from "react-icons/fa";

/**
 * Yup validation schema for building add form.
 *
 * @constant {object} buildingAddFormSchema
 * */
const buildingAddFormSchema = Yup.object().shape({
  name: Yup.string()
    .min(1, "Must be at least 1 character")
    .max(60, "Must be at most 60 characters")
    .required("Name is required")
    .matches(/\b([A-ZÀ-ÿ][-,a-z. ']+[ ]*)+/, "Invalid format"),
});

/** Modal for building creation in building management dashboard */
function BuildingAddModal(props) {
  const [isConfirm, setIsConfirm] = useState(false);

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  /**
   * Resets all state.
   *
   * @function resetAll
   * */
  const resetAll = () => {
    setIsConfirm(false);
    setSuccess(false);
    setError(false);
    setErrorMessage("");
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
          name: "",
        }}
        validationSchema={buildingAddFormSchema}
        onSubmit={async (values, handlers) => {
          let status = await props.handleSubmit(values, handlers);
          if (status.success) setSuccess(true);
          else {
            setError(true);
            setErrorMessage(status.errorMessage);
          }
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
                  <Form.Label>Name</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      id="name"
                      placeholder="Enter name"
                      isInvalid={!!formik.errors.name}
                      {...formik.getFieldProps("name")}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.name}
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
                              {errorMessage}
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

BuildingAddModal.propTypes = {
  /** Determines whether modal should be shown */
  show: PropTypes.bool,
  handleClose: PropTypes.func,
  /** Submission handler */
  handleSubmit: PropTypes.func,
};

export default BuildingAddModal;
