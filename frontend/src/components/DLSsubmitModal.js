import { React, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Col, Row, Modal, Button } from "react-bootstrap";
import { FaCheck, FaWindowClose, FaRegWindowClose } from "react-icons/fa";

/** Data Logging Scheduler submit modal. */
function DLSsubmitModal(props) {
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {!props.error && !props.success
            ? "Are you sure you want to submit this Data Log Schedule?"
            : props.success
            ? "Success"
            : "Error"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Footer className="align-self-center">
        {!props.error && !props.success ? (
          <>
            <Button
              className="d-flex flex-row align-items-center gap-2"
              onClick={props.submit}
            >
              <FaCheck />
              <span>Confirm</span>
            </Button>
            <Button
              className="d-flex flex-row align-items-center gap-2"
              variant="secondary"
              onClick={props.onHide}
            >
              <FaRegWindowClose />
              <span>Cancel</span>
            </Button>
          </>
        ) : props.success ? (
          "Data log creation was successful"
        ) : (
          props.errorMessage
        )}
      </Modal.Footer>
    </Modal>
  );
}

DLSsubmitModal.propType = {
  show: PropTypes.bool,
  onHide: PropTypes.func,
  submit: PropTypes.func,
  error: PropTypes.bool,
  success: PropTypes.bool,
  errorMessage: PropTypes.bool,
};

export default DLSsubmitModal;
