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

/** Data Log  Details screen for advanced users. */
function DataLogDetailModal(props) {
  const [isDelete, setIsDelete] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  /**
   * Resets detele.
   *
   * @function resetDelete
   * */
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
      <Modal.Body as={Row} className="overflow-auto">
        <Col className="d-flex flex-column">
          <Card className="manage-card mb-3">
            <Card.Body as={Row}>
              <Col className="d-flex flex-row gap-3 align-items-start">
                <span className="text-break bold">Meter</span>
                <span className="text-break">{props.selectedEntry.meter}</span>
              </Col>
            </Card.Body>
          </Card>
          <Card className="manage-card mb-3">
            <Card.Body as={Row}>
              <Col className="d-flex flex-row gap-3 align-items-start">
                <span className="text-break bold">Data Points</span>
                <span className="text-break">
                  {props.selectedEntry.dataPointNames}
                </span>
              </Col>
            </Card.Body>
          </Card>
          <Card className="manage-card mb-3">
            <Card.Body as={Row}>
              <Col className="d-flex flex-row gap-3 align-items-start">
                <span className="text-break bold">Start Date</span>
                <span className="text-break">
                  {props.selectedEntry.startDate}
                </span>
              </Col>
            </Card.Body>
          </Card>
          <Card className="manage-card mb-3">
            <Card.Body as={Row}>
              <Col className="d-flex flex-row gap-3 align-items-start">
                <span className="text-break bold">End Date</span>
                <span className="text-break">
                  {props.selectedEntry.endDate}
                </span>
              </Col>
            </Card.Body>
          </Card>
          <Card className="manage-card mb-3">
            <Card.Body as={Row}>
              <Col className="d-flex flex-row gap-3 align-items-start">
                <span className="text-break bold">Sampling Rate</span>
                <span className="text-break">
                  {`${props.selectedEntry.samplingRate / 60} minutes`}
                </span>
              </Col>
            </Card.Body>
          </Card>
        </Col>
      </Modal.Body>
    </Modal>
  );
}

DataLogDetailModal.propTypes = {
  /** Determines whether modal should be shown */
  show: PropTypes.bool,
  handleCloseDetails: PropTypes.func,
  /** Data Log entry data */
  selectedEntry: PropTypes.object,
};

export default DataLogDetailModal;
