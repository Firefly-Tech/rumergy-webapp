import React, { useState } from "react";
import PropTypes from "prop-types";
import { Modal, Row, Col, Button, Form, InputGroup } from "react-bootstrap";
import { FieldArray, Formik } from "formik";
import * as Yup from "yup";
import { FaPlus, FaExclamation, FaCheck } from "react-icons/fa";
import DataPointFieldGroup from "./DataPointFieldGroup";

/**
 * Data types for register data
 *
 * @constant {object} dataTypes
 * */
const dataTypes = {
  Integer: "INT",
  Float: "FLT",
};

/**
 * Modbus register types
 *
 * @constant {object} registerTypes
 * */
const registerTypes = {
  Coil: "COIL",
  Discrete: "DISC",
  Input: "INPU",
  Holding: "HOLD",
};

/**
 * Adding Yup method to test object property
 * uniqueness
 */
Yup.addMethod(Yup.array, "unique", function (message, mapper = (a) => a) {
  return this.test("unique", message, function (list) {
    return list.length === new Set(list.map(mapper)).size;
  });
});

/**
 * Yup validation schema for meter model add form.
 *
 * @constant {object} meterModelAddFormSchema
 * */
const meterModelAddFormSchema = Yup.object().shape({
  name: Yup.string()
    .min(1, "Must be at least 1 character")
    .max(60, "Must be at most 60 characters")
    .required("Name is required"),
  dataPoints: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string()
          .min(1, "Must be at least 1 character")
          .max(50, "Must be at most 50 characters")
          .required("Name is required"),
        unit: Yup.string()
          .min(1, "Must be at least 1 character")
          .max(10, "Must be at most 10 characters")
          .required("Unit is required"),
        startAddress: Yup.number("Must be a number")
          .integer("Must be an integer")
          .min(0, "Must be 0 or greater.")
          .max(65535, "Maximum address number is 65535")
          .required("Start address required"),
        endAddress: Yup.number("Must be a number")
          .integer("Must be an integer")
          .max(65535, "Maximum address number is 65535")
          .min(
            Yup.ref("startAddress"),
            "End address must be greater or equal to start address"
          )
          .required("End address required"),
        dataType: Yup.string()
          .required("Data type required")
          .oneOf(Object.values(dataTypes)),
        registerType: Yup.string()
          .required("Register type required")
          .oneOf(Object.values(registerTypes)),
      })
    )
    .unique("Data point names must be unique", (dataPoint) => dataPoint.name)
    .required("Data points required")
    .min(
      2,
      "At a minimum, the consumption and demand data points must be provided"
    ),
});

function MeterModelAddModal(props) {
  const [isConfirm, setIsConfirm] = useState(false);

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
          dataPoints: [
            {
              name: "consumption",
              unit: "kwh",
              startAddress: "",
              endAddress: "",
              dataType: dataTypes.Float,
              registerType: registerTypes.Holding,
            },
            {
              name: "demand",
              unit: "kw",
              startAddress: "",
              endAddress: "",
              dataType: dataTypes.Float,
              registerType: registerTypes.Holding,
            },
          ],
        }}
        validationSchema={meterModelAddFormSchema}
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
              <Modal.Body className="meter-model-fields overflow-auto px-3">
                <Row>
                  <Col className="">
                    <Form.Group className="mb-3">
                      <Form.Label>Meter Name</Form.Label>
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
                    <FieldArray
                      name="dataPoints"
                      render={({ insert, remove, push }) => (
                        <>
                          {formik.values.dataPoints.map((dataPoint, index) => (
                            <DataPointFieldGroup
                              key={index}
                              index={index}
                              formik={formik}
                              remove={remove}
                              staticName={
                                index < 2 &&
                                (dataPoint.name === "consumption" ||
                                  dataPoint.name === "demand")
                              }
                              dataTypes={dataTypes}
                              registerTypes={registerTypes}
                            />
                          ))}
                          <Button
                            variant="primary"
                            onClick={(e) => {
                              e.preventDefault();
                              push({
                                name: "",
                                unit: "",
                                startAddress: "",
                                endAddress: "",
                                dataType: dataTypes.Float,
                                registerType: registerTypes.Holding,
                              });
                            }}
                          >
                            Add datapoint
                          </Button>
                        </>
                      )}
                    />
                  </Col>
                </Row>
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
                        <Col>{"Are you sure you wish to add this model?"}</Col>
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

MeterModelAddModal.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
  handleSubmit: PropTypes.func,
};

export default MeterModelAddModal;
