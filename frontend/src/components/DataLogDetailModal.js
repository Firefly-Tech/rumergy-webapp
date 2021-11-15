import React, { useState } from "react";
import PropTypes from "prop-types";
import { Modal, Row, Col, Button, Form, InputGroup } from "react-bootstrap";
import { FaSync, FaTrash, FaExclamation, FaCheck } from "react-icons/fa";


function DataLogDetailModal(props){
    const [isDelete, setIsDelete] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);

    const resetDelete = () => {
        setIsDelete(false);
    };

    return(
        <Modal
            centered
            size="lg"
            show ={props.show}
            onHide={() => {
                props.handleClose();
                resetDelete();
            }}
            backdrop = "static"
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    <h4 className="bold">Data Log Details</h4>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                

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
                                                            resetDelete();
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
                                        {isDelete ? (
                                            <Row className="mb-3">
                                                <Col>
                                                    {`Are you sure you wish to delete this entry?`}
                                                </Col>
                                            </Row>
                                        ) : null}
                                            <Row>
                                                <Col className="d-flex flex-row gap-4 justify-content-center align-items-center mx-auto">
                                                    {isDelete ? (
                                                        <>
                                                            <Button
                                                                type="submit"
                                                                variant={"danger"}
                                                                className={`d-flex flex-row align-items-center gap-2 ${
                                                                    isDelete ? "text-white" : ""
                                                                }`}
                                                            >
                                                                <>
                                                                    <FaTrash />
                                                                    Delete
                                                                </>
                                                            </Button>
                                                            <Button
                                                                variant="secondary"
                                                                className="d-flex flex-row align-items-center gap-2 text-white"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    setIsDelete(false);
                                                                }}
                                                            >
                                                            Cancel
                                                            </Button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Button
                                                                variant="danger"
                                                                className="d-flex flex-row align-items-center gap-2 text-white"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    setIsDelete(true);
                                                                }}
                                                            >
                                                                <FaTrash />
                                                                Delete
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

DataLogDetailModal.propTypes = {
    show: PropTypes.bool,
    handleCloseDetails: PropTypes.func,
}

export default DataLogDetailModal;