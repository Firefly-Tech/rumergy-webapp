import React, { useState } from "react";
import PropTypes from "prop-types";
import { Modal, Row, Col, Button, Form, InputGroup } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import { FaSync, FaTrash, FaExclamation, FaCheck } from "react-icons/fa";
import { meterStatus } from "./ManageMeter";

/**
 * Yup validation schema for meter edit form.
 *
 * @constant {object} meterEditFormSchema
 * */
const meterEditFormSchema = Yup.object().shape({
  name: Yup.string()
    .min(1, "Must be at least 1 character")
    .max(50, "Must be at most 50 characters")
    .required("Name is required")
    .matches(/\b([A-ZÀ-ÿ][-,a-z. ']+[ ]*)+/, "Invalid format"),
  meter_model: Yup.number().integer().required("Choosing a model is required"),
  ip: Yup.string()
    .required("IP is required")
    .matches(
      /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
      "Invalid format"
    ),
  port: Yup.number()
    .typeError("Must be a number")
    .integer("Must be an integer")
    .required("Port is required")
    .min(0, "Must be positive")
    .max(65535, "Max port number is 65535")
    .default(502),
  building: Yup.number().integer().required("Building is required"),
  status: Yup.string().required("Status required"),
  // Optional fields
  substation: Yup.string()
    .max(60, "Must be at most 60 characters")
    .default("None")
    .optional(),
  longitude: Yup.number()
    .typeError("Must be a number")
    .min(-180, "Minimum is -180")
    .max(180, "Maximum is 180")
    .default(0)
    .optional(),
  latitude: Yup.number()
    .typeError("Must be a number")
    .min(-90, "Minimum is -90")
    .max(90, "Maximum is 90")
    .default(0)
    .optional(),
  comments: Yup.string()
    .max(200, "Must be 200 characters at most")
    .default("None")
    .optional(),
  panel_id: Yup.string()
    .max(60, "Must be 60 characters at most")
    .default("None")
    .optional(),
  serial_number: Yup.string()
    .max(100, "Must be 100 characters at most")
    .default("None")
    .optional(),
});

/** Modal for meter edits in meter management dashboard */
function MeterEditModal(props) {
  const [isUpdate, setIsUpdate] = useState(false);
  const [isDelete, setIsDelete] = useState(false);

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  /**
   * Resets all state.
   *
   * @function resetAll
   * */
  const resetAll = () => {
    setIsUpdate(false);
    setIsDelete(false);
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
          <h4 className="bold">Edit Meter</h4>
        </Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={{
          name: props.selectedEditEntry.name,
          meter_model: props.selectedEditEntry.meter_model.id,
          ip: props.selectedEditEntry.ip,
          port: props.selectedEditEntry.port,
          building: props.selectedEditEntry.building.id,
          substation: props.selectedEditEntry.substation,
          longitude: props.selectedEditEntry.longitude,
          latitude: props.selectedEditEntry.latitude,
          comments: props.selectedEditEntry.comments,
          panel_id: props.selectedEditEntry.panel_id,
          serial_number: props.selectedEditEntry.serial_number,
          status: props.selectedEditEntry.status,
        }}
        validationSchema={meterEditFormSchema}
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
          if (status.success) setSuccess(true);
          else {
            setError(true);
            setErrorMessage(status.errorMessage);
          }
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
              <Modal.Body className="modal-scroll overflow-auto px-3">
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
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
                  <Form.Label>Meter Model</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Select
                      id="meter_model"
                      placeholder="Select meter model"
                      isInvalid={!!formik.errors.meter_model}
                      {...formik.getFieldProps("meter_model")}
                    >
                      {props.meterModels.map((model, index) => (
                        <option value={model.id} key={index}>
                          {model.name}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.meter_model}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>IP Address</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      id="ip"
                      placeholder="Enter IP"
                      isInvalid={!!formik.errors.ip}
                      {...formik.getFieldProps("ip")}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.ip}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Port</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      id="port"
                      placeholder="Enter port"
                      isInvalid={!!formik.errors.port}
                      {...formik.getFieldProps("port")}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.port}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Building</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Select
                      id="building"
                      placeholder="Enter building"
                      isInvalid={!!formik.errors.building}
                      {...formik.getFieldProps("building")}
                    >
                      {props.buildings.map((building, index) => (
                        <option value={building.id} key={index}>
                          {building.name}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.building}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Select
                      id="status"
                      placeholder="Enter status"
                      isInvalid={!!formik.errors.status}
                      {...formik.getFieldProps("status")}
                    >
                      {Object.keys(meterStatus).map((key, index) => (
                        <option value={meterStatus[key]} key={index}>
                          {key}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.status}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Substation</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      id="substation"
                      placeholder="[Optional] Enter substation"
                      isInvalid={!!formik.errors.substation}
                      {...formik.getFieldProps("substation")}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.substation}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Latitude</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      id="latitude"
                      placeholder="[Optional] Enter latitude"
                      isInvalid={!!formik.errors.latitude}
                      {...formik.getFieldProps("latitude")}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.latitude}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Longitude</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      id="longitude"
                      placeholder="[Optional] Enter longitude"
                      isInvalid={!!formik.errors.longitude}
                      {...formik.getFieldProps("longitude")}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.longitude}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Comments</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      id="comments"
                      as="textarea"
                      placeholder="[Optional] Enter comments"
                      isInvalid={!!formik.errors.comments}
                      {...formik.getFieldProps("comments")}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.comments}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Panel ID</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      id="panel_id"
                      placeholder="[Optional] Enter panel id"
                      isInvalid={!!formik.errors.panel_id}
                      {...formik.getFieldProps("panel_id")}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.panel_id}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Serial Number</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      id="serial_number"
                      placeholder="[Optional] Enter serial number"
                      isInvalid={!!formik.errors.serial_number}
                      {...formik.getFieldProps("serial_number")}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.serial_number}
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

MeterEditModal.propTypes = {
  /** Determines whether modal should be shown */
  show: PropTypes.bool,
  handleClose: PropTypes.func,
  /** Meter entry data */
  selectedEditEntry: PropTypes.object,
  /** Edit handler */
  handleEdit: PropTypes.func,
  /** Deletion handler */
  handleDelete: PropTypes.func,
  meterModels: PropTypes.array,
  buildings: PropTypes.array,
  loading: PropTypes.bool,
};

export default MeterEditModal;
