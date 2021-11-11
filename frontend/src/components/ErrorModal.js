import React from "react";
import PropTypes from "prop-types";
import { Modal, Button } from "react-bootstrap";

function ErrorModal(props) {
  return (
    <Modal centered size="lg" show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          <h4 className="bold">{props.errorName}</h4>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.errorMessage}</Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={props.handleClose}>
          Okay
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

ErrorModal.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
  errorName: PropTypes.string,
  errorMessage: PropTypes.string,
};

export default ErrorModal;