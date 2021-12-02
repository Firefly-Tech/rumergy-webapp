import React, { useState } from "react";
import PropTypes from "prop-types";
import { Card, Form, InputGroup } from "react-bootstrap";
import IconButton from "./IconButton";
import { FaTimes } from "react-icons/fa";

function DataPointFieldGroup(props) {
  /**
   * Checks if an error exists for the given property.
   *
   * @function checkDataPointError
   * @param {string} property - Data point property
   * @returns {bool}
   * */
  const checkDataPointError = (property) => {
    return Array.isArray(props.formik.errors.dataPoints)
      ? props.formik.errors.dataPoints[props.index] !== undefined
        ? !!props.formik.errors.dataPoints[props.index][property]
        : false
      : false;
  };

  /**
   * Returns the error string for the given property;
   * if it exists.
   *
   * @function getDataPointError
   * @param {string} property - Data point property
   * @returns {string}
   * */
  const getDataPointError = (property) => {
    return Array.isArray(props.formik.errors.dataPoints)
      ? props.formik.errors.dataPoints[props.index] !== undefined
        ? props.formik.errors.dataPoints[props.index][property]
        : null
      : null;
  };

  return (
    <Card className="manage-card mb-4">
      <Card.Title className="d-flex flex-row px-3 pt-3 bold">
        <h4 className="bold me-auto">{`Data Point ${props.index + 1}`}</h4>
        {!props.staticName ? (
          <IconButton
            clickAction={() => props.remove(props.index)}
            icon={<FaTimes />}
          />
        ) : null}
      </Card.Title>
      <Card.Subtitle className="px-3 text-danger">
        {typeof props.formik.errors.dataPoints === "string" ? (
          <div>{props.formik.errors.dataPoints}</div>
        ) : null}
      </Card.Subtitle>
      <Card.Body>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <InputGroup hasValidation>
            <Form.Control
              id={`dataPoints.${props.index}.name`}
              placeholder="Enter data point name"
              disabled={props.staticName}
              isInvalid={checkDataPointError("name")}
              {...props.formik.getFieldProps(`dataPoints.${props.index}.name`)}
            />
            <Form.Control.Feedback type="invalid">
              {getDataPointError("name")}
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Units</Form.Label>
          <InputGroup hasValidation>
            <Form.Control
              id={`dataPoints.${props.index}.unit`}
              placeholder="Enter the units for this datapoint"
              disabled={props.staticName}
              isInvalid={checkDataPointError("unit")}
              {...props.formik.getFieldProps(`dataPoints.${props.index}.unit`)}
            />
            <Form.Control.Feedback type="invalid">
              {getDataPointError("unit")}
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Starting Address</Form.Label>
          <InputGroup hasValidation>
            <Form.Control
              id={`dataPoints.${props.index}.startAddress`}
              type="number"
              placeholder="Enter starting register address"
              isInvalid={checkDataPointError("startAddress")}
              {...props.formik.getFieldProps(
                `dataPoints.${props.index}.startAddress`
              )}
            />
            <Form.Control.Feedback type="invalid">
              {getDataPointError("startAddress")}
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Ending Address</Form.Label>
          <InputGroup hasValidation>
            <Form.Control
              id={`dataPoints.${props.index}.endAddress`}
              type="number"
              placeholder="Enter ending register address"
              isInvalid={checkDataPointError("endAddress")}
              {...props.formik.getFieldProps(
                `dataPoints.${props.index}.endAddress`
              )}
            />
            <Form.Control.Feedback type="invalid">
              {getDataPointError("endAddress")}
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Register Type</Form.Label>
          <InputGroup hasValidation>
            <Form.Select
              id={`dataPoints.${props.index}.registerType`}
              placeholder="Select role"
              isInvalid={checkDataPointError("registerType")}
              {...props.formik.getFieldProps(
                `dataPoints.${props.index}.registerType`
              )}
            >
              {Object.keys(props.registerTypes).map((key, index) => (
                <option key={index} value={props.registerTypes[key]}>
                  {key}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {getDataPointError("registerType")}
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Data Type</Form.Label>
          <InputGroup hasValidation>
            <Form.Select
              id={`dataPoints.${props.index}.dataType`}
              placeholder="Select role"
              isInvalid={checkDataPointError("dataType")}
              {...props.formik.getFieldProps(
                `dataPoints.${props.index}.dataType`
              )}
            >
              {Object.keys(props.dataTypes).map((key, index) => (
                <option key={index} value={props.dataTypes[key]}>
                  {key}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {getDataPointError("dataType")}
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
      </Card.Body>
    </Card>
  );
}

DataPointFieldGroup.propTypes = {
  staticName: PropTypes.bool,
  index: PropTypes.number,
  formik: PropTypes.object,
  remove: PropTypes.func,
  dataTypes: PropTypes.object,
  registerTypes: PropTypes.object,
};

export default DataPointFieldGroup;
