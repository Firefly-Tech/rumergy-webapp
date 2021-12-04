import React, { useState } from "react";
import PropTypes from "prop-types";
import { Modal, Row, Col, Button, Form, InputGroup } from "react-bootstrap";
import {
  FaSync,
  FaTrash,
  FaExclamation,
  FaCheck,
  FaCloudDownloadAlt,
} from "react-icons/fa";

function DataLogDownloadModal(props) {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  return (
    <Modal
      centered
      size="lg"
      show={props.show}
      onHide={() => {
        props.handleClose();
      }}
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <h4 className="bold">Download Completed Data Log</h4>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Col>
          {props.selectedEntry.completed ? (
            <p>This data log schedule has been completed.</p>
          ) : (
            <p>
              This data log has not been completed. Please try again after the
              end date has passed
            </p>
          )}
        </Col>
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
            <Row>
              <Col className="d-flex flex-row gap-4 justify-content-center align-items-center mx-auto">
                <>
                  <Button
                    variant="primary"
                    className="d-flex flex-row align-items-center gap-2 text-black"
                    disabled={!props.selectedEntry.completed}
                    onClick={(e) => {
                      e.preventDefault();
                      props.download(props.selectedEntry.id);
                    }}
                  >
                    <FaCloudDownloadAlt />
                    Download
                  </Button>
                </>
              </Col>
            </Row>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
}

DataLogDownloadModal.propTypes = {
  show: PropTypes.bool,
  selectedEntry: PropTypes.object,
  handleCloseDetails: PropTypes.func,
  download: PropTypes.func,
};

export default DataLogDownloadModal;

