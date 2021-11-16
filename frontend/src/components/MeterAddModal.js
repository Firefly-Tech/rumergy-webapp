import React, { useState } from "react";
import PropTypes from "prop-types";
import { Modal, Row, Col, Button, Form, InputGroup } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
//import { roles } from "../resources/constants";
import { FaPlus, FaExclamation, FaCheck } from "react-icons/fa";

//Ask Milton
// const {General, ...userRoles} = roles;

const meterAddFormSchema = Yup.object().shape({
  name: Yup.string()
    .min(1, "Must be at least 1 character")
    .max(50, "Must be at most 50 characters")
    .required("Name is required")
    .matches(/\b([A-ZÀ-ÿ][-,a-z. ']+[ ]*)+/, "Invalid format"),

  model: Yup.string().required("Choosing a model is required"),

  ip: Yup.string()
    .required("IP is required")
    .matches(
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
      "Invalid format"
    ),

  port: Yup.string()
    .required("Port is required")
    .matches(
      /^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/,
      "Invalid format"
    ),

  building: Yup.string().required("Choosing a building is required"),
});

function MeterAddModal(props) {
  const [isConfirm, setIsConfirm] = useState(false);

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

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
          <h4 className="bold"> Add Meter</h4>
        </Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={{
          name: "",
          model: "",
          ip: "",
          port: "502",
          building: "",
        }}
        validationSchema={meterAddFormSchema}
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
                  <Form.Label>Meter Model</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Select
                      id="model"
                      placeholder="Enter meter model"
                      isInvalid={!!formik.errors.model}
                      {...formik.getFieldProps("model")}
                    >
                        <option>Choose a Model</option>
                        <option value="1">Model 1</option>
                        <option value="2">Model 2</option>
                        <option value="3">Model 3</option>
                    </Form.Select>
                  </InputGroup>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>IP</Form.Label>
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
                  <Form.Label> Building</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Select
                      id="building"
                      placeholder="Enter building"
                      isInvalid={!!formik.errors.building}
                      {...formik.getFieldProps("building")}
                    >
                        <option>Choose a Building</option>
                        <option value="1">Chardon</option>
                        <option value="2">Biology</option>
                        <option value="3">Stefani</option>
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
                                Try Again
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
                        <Col>{"Are you sure you wish to add this meter"}</Col>
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
                                "d-flex flexx-row align-items-center gap-2"
                              }
                            >
                              <faPlus />
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

MeterAddModal.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
  handleSubmit: PropTypes.func,
};

export default MeterAddModal;
