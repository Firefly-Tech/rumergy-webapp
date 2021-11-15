import React, { useState } from "react";
import PropTypes from "prop-types";
import { Modal, Row, Col, Button, Form, InputGroup } from "react-bootstrap";
import { FaSync, FaTrash, FaExclamation, FaCheck, FaCloudDownloadAlt } from "react-icons/fa";

function DataLogDownloadModal(props){
    const [isDownload, setIsDownload] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);

    const resetDownload = () => {
        setIsDownload(false);
    };

    return(
        <Modal
            centered
            size="lg"
            show ={props.show}
            onHide={() => {
                props.handleClose();
                resetDownload();
            }}
            backdrop = "static"
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    <h4 className="bold">Download Completed Data Log</h4>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Col>
                    <h5>This data log schedule has been completed.</h5>
                </Col>
            </Modal.Body>
            <Modal.Footer className = "d-flex flex-column">
                    {success || error ? (
                        <Row>
                            <Col className = "d-flex flex-column align-items-center">
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
                                                            resetDownload();
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
                                        {isDownload ? (
                                            <Row className="mb-3">
                                                <Col>
                                                    {`Are you sure you wish to download this data log?`}
                                                </Col>
                                            </Row>
                                        ) : null}
                                            <Row>
                                                <Col className="d-flex flex-row gap-4 justify-content-center align-items-center mx-auto">
                                                    {isDownload ? (
                                                        <>
                                                            <Button
                                                                type="submit"
                                                                variant={"primary"}
                                                                className={`d-flex flex-row align-items-center gap-2 ${
                                                                    isDownload ? "text-black" : ""
                                                                }`}
                                                            >
                                                                <>
                                                                    <FaCloudDownloadAlt />
                                                                    Download
                                                                </>
                                                            </Button>
                                                            <Button
                                                                variant="secondary"
                                                                className="d-flex flex-row align-items-center gap-2 text-white"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    setIsDownload(false);
                                                                }}
                                                            >
                                                            Cancel
                                                            </Button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Button
                                                                variant="primary"
                                                                className="d-flex flex-row align-items-center gap-2 text-black"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    setIsDownload(true);
                                                                }}
                                                            >
                                                                <FaCloudDownloadAlt />
                                                                Download
                                                            </Button>
                                                        </>
                                                        )}
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
    handleCloseDetails: PropTypes.func,
}

export default DataLogDownloadModal;