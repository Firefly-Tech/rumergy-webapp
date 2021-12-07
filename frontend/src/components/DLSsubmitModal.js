import { React, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Col, Row, Modal, Button } from "react-bootstrap";
import { FaCheck, FaWindowClose, FaRegWindowClose } from "react-icons/fa";

function DLSsubmitModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Are you sure you want to submit this Data Log Schedule?
        </Modal.Title>
      </Modal.Header>
      <Modal.Footer className="align-self-center">
        {/* Confirm the DataLog */}
        <Button
          className="d-flex flex-row align-items-center gap-2"
          type="submit"
        >
          {<FaCheck />} Confirm
        </Button>

        <Button
          className="d-flex flex-row align-items-center gap-2"
          variant="secondary"
          onClick={props.onHide}
        >
          {<FaRegWindowClose />} Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

DLSsubmitModal.propType = {
  show: PropTypes.bool,
  onHide: PropTypes.func,
  handleSubmit: PropTypes.func,
};

export default DLSsubmitModal;
