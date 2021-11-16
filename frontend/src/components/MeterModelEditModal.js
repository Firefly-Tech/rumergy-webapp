import React, { useState } from "react";
import PropTypes from "prop-types";
import { Modal, Row, Col, Button, Form, InputGroup } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import { FaSync, FaTrash, FaExclamation, FaCheck } from "react-icons/fa";
//import { roles } from "../resources/constants";

//Ask Milton
// const {General, ...userRoles} = roles;

const meterModelEditFormSchema = Yup.object().shape({
  name: Yup.string()
    .min(1, "Must be at least 1 character")
    .max(50, "Must be at most 50 characters")
    .required("Name is required")
    .matches(/\b([A-ZÀ-ÿ][-,a-z. ']+[ ]*)+/, "Invalid format"),
  datapoint: Yup.string()
    .min(1, "Must be at least 1 character")
    .max(50, "Must be at most 50 characters")
    .required("Data point is required")
    .matches(/\b([A-ZÀ-ÿ][-a-z. ']+[ ]*)+/, "Invalid format"),
  start: Yup.string().required("Start is required"),

  end: Yup.string().required("End is required"),

  type: Yup.string().required("Choosing a type required"),

  units: Yup.string()
    .min(1, "Must be at least 1 character")
    .max(50, "Must be at most 50 characters")
    .required("Units are required")
    .matches(/\b([A-ZÀ-ÿ][-a-z. ']+[ ]*)+/, "Invalid format"),

  regtype: Yup.string().required("Choosing a regtype required"),
});

function MeterModelEditModal(props) {
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
          <h4 className="bold">Edit Meter Model</h4>
        </Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={{
          name: props.selectedEditEntry.name,
          datafields: props.selectedEditEntry.datafields,
          datapoint: props.selectedEditEntry.datapoint,
          start: props.selectedEditEntry.start,
          end: props.selectedEditEntry.end,
          type: props.selectedEditEntry.type,
          units: props.selectedEditEntry.units,
          regtype: props.selectedEditEntry.regtype,
        }}
        validationSchema={meterModelEditFormSchema}
        onSubmit={async (values, handlers) => {
          let status;
          if (isUpdate) {
            status = await props.handleEdit(
              props.selectedEditEntry.id,
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
              className="d-felx flex-column"
            >
              <Modal.Body>
                <Form.Group className="mb-3">
                  <Form.Label> Name </Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      id="name"
                      placeholder="Enter meter name"
                      isInvalid={!!formik.errors.name}
                      {...formik.getFieldProps("name")}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.name}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Data Point</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      id="datapoint"
                      placeholder="Enter data point"
                      isInvalid={!!formik.errors.datapoint}
                      {...formik.getFieldProps("datapoint")}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.datapoint}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Start</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      id="start"
                      placeholder="Enter start"
                      isInvalid={!!formik.errors.start}
                      {...formik.getFieldProps("start")}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.start}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>End</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      id="end"
                      placeholder="Enter end"
                      isInvalid={!!formik.errors.end}
                      {...formik.getFieldProps("end")}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.end}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Type</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Select
                      id="type"
                      placeholder="Enter data point type"
                      isInvalid={!!formik.errors.type}
                      {...formik.getFieldProps("type")}
                    >
                      <option>Choose a Type</option>
                      <option value="1">Float</option>
                      <option value="2">Other type</option>
                      <option value="3">Another type</option>
                    </Form.Select>
                  </InputGroup>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Data Point Unit</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      id="units"
                      placeholder="Enter data point units"
                      isInvalid={!!formik.errors.units}
                      {...formik.getFieldProps("units")}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.units}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Register Type</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Select
                      id="regtype"
                      placeholder="Enter register type"
                      isInvalid={!!formik.errors.regtype}
                      {...formik.getFieldProps("regtype")}
                    >
                      <option>Choose a Register Type</option>
                      <option value="1">Holding Register</option>
                      <option value="2">Other Register</option>
                      <option value="3">Another Register</option>
                    </Form.Select>
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

MeterModelEditModal.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
  selectedEditEntry: PropTypes.object,
  handleEdit: PropTypes.func,
  handleDelete: PropTypes.func,
};

export default MeterModelEditModal;
