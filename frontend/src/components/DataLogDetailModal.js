import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Modal,
  Row,
  Col,
  Button,
  Form,
  InputGroup,
  Card,
  Table,
} from "react-bootstrap";
import { FaSync, FaTrash, FaExclamation, FaCheck } from "react-icons/fa";

function DataLogDetailModal(props) {
  const [isDelete, setIsDelete] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const resetDelete = () => {
    setIsDelete(false);
  };

  return (
    <Modal
      centered
      size="lg"
      show={props.show}
      onHide={() => {
        props.handleClose();
        resetDelete();
      }}
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <h4 className="bold">Data Log Details</h4>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body as= {Row} className = "overflow-auto">
        <Col className = "d-flex fle-column">
          {/* {Object.keys(props.selectedEntry).map((key, index) => (
            <Card className = "manage-card mb-3" key = {index}>
              <Card.Body as={Row}>
                <Col className="d-flex flex-row gap-3 align-items-start">
                  <span className="text-break bold">{key}</span>
                  <span className="text-break">{props.selectedEntry[key]}</span>
                </Col>
              </Card.Body>
            </Card>
          ))} */}
        </Col>
      </Modal.Body>
      
    </Modal>
  );
}

DataLogDetailModal.propTypes = {
  show: PropTypes.bool,
  handleCloseDetails: PropTypes.func,
  selectedEntry: PropTypes.object,
};

export default DataLogDetailModal;
