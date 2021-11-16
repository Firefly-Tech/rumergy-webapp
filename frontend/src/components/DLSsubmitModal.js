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
                                {/* Comfirm the DataLog */}
        <Button className="d-flex align-items-center" onClick={props.onHide}> 
          {<FaCheck />} Confirm 
        </Button>

        <Button
          className="d-flex align-items-center"
          variant="secondary"
          onClick={props.onHide}
        >
          {<FaRegWindowClose />} Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DLSsubmitModal;

