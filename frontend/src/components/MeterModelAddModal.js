import React, { useState } from "react";
import PropTypes from "prop-types";
import { Modal, Row, Col, Button, Form, InputGroup } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import { FaPlus, FaExclamation, FaCheck } from "react-icons/fa";
//import { roles } from "../resources/constants";

//Ask Milton 
// const {General, ...userRoles} = roles; 

const meterModelAddFormSchema = Yup.object().shape({
    name: Yup.string()
        .min(1, "Must be at least 1 character")
        .max(50, "Must be at most 50 characters")
        .required("Name is required")
        .matches(/\b([A-ZÀ-ÿ][-,a-z. ']+[ ]*)+/, "Invalid format"),
    datapoint: Yup.string()
        .min(1, "Must be at least 1 character")
        .max(50, "Must be at most 50 characters")
        .required("Data fields are required")
        .matches(/\b([A-ZÀ-ÿ][-a-z. ']+[ ]*)+/, "Invalid format"), //ask about this
    start: Yup.number(),

    end: Yup.number(),

    type: Yup.string(),

    units: Yup.string()
        .min(1, "Must be at least 1 character")
        .max(50, "Must be at most 50 characters")
        .required("Data fields are required")
        .matches(/\b([A-ZÀ-ÿ][-a-z. ']+[ ]*)+/, "Invalid format"), //ask about this
    
    regtype: Yup.string(),
    



});

function MeterModelAddModal(props){
    const [isConfirm, setIsConfirm] = useState(false);

    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    
    const resetAll = () => {
        setIsConfirm(false);
        setSuccess(false);
        setError(false);
    };

    return(
        <Modal
            centered
            size="lg"
            show ={props.show}
            onHide={() => {
                props.handleClose();
                resetAll();
            }}
            backdrop = "static"
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    <h4 className = "bold"> Add Meter Model</h4>
                </Modal.Title>
            </Modal.Header>
            <Formik
                initialValues={{
                    name: "",
                    datapoint: "",
                    start: "",
                    end: "",
                    type: "Float",
                    units: "",
                    regtype: "Holding Register",

                }}
                validationSchema = {meterModelAddFormSchema}
                onSubmit = {async (values, handlers) => {
                    let status = await props.handleSubmit(values, handlers);
                    if(status) setSuccess(true);
                    else setError(true);
                }}
            >
                {(formik) =>(
                    <>
                        <Form
                            onSubmit = {formik.handleSubmit}
                            noValidate
                            className = "d-felx flex-column"
                        >
                            <Modal.Body>
                                <Form.Group className = "mb-3">
                                    <Form.Label> Name </Form.Label>
                                    <InputGroup hasValidation>
                                        <Form.Control
                                            id = "name"
                                            placeholder = "Enter meter name"
                                            isInvalid = {!!formik.errors.name}
                                            {...formik.getFieldProps("name")}
                                        />
                                        <Form.Control.Feedback type = "invalid">
                                            {formik.errors.name}
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                </Form.Group>
                                <Form.Group className = "mb-3">
                                    <Form.Label>Data Point</Form.Label>
                                    <InputGroup hasValidation>
                                        <Form.Control
                                            id = "datapoint"
                                            placeholder = "Enter data point"
                                            isInvalid = {!!formik.errors.datapoint}
                                            {...formik.getFieldProps("datapoint")}
                                        />
                                        <Form.Control.Feedback type = "invalid">
                                            {formik.errors.datapoint}
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                </Form.Group>
                                <Form.Group className = "mb-3">
                                    <Form.Label>Start</Form.Label>
                                    <InputGroup hasValidation>
                                        <Form.Control
                                            id = "start"
                                            placeholder = "Enter start"
                                            isInvalid = {!!formik.errors.start}
                                            {...formik.getFieldProps("start")}
                                        />
                                        <Form.Control.Feedback type = "invalid">
                                            {formik.errors.start}
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                </Form.Group>
                                <Form.Group className = "mb-3">
                                    <Form.Label>End</Form.Label>
                                    <InputGroup hasValidation>
                                        <Form.Control
                                            id = "end"
                                            placeholder = "Enter end"
                                            isInvalid = {!!formik.errors.end}
                                            {...formik.getFieldProps("end")}
                                        />
                                        <Form.Control.Feedback type = "invalid">
                                            {formik.errors.end}
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                </Form.Group>
                                <Form.Group className = "mb-3">
                                    <Form.Label>Type</Form.Label>
                                    <InputGroup hasValidation>
                                        <Form.Select
                                            id = "type"
                                            placeholder = "Enter data point type"
                                            isInvalid = {!!formik.errors.type}
                                            {...formik.getFieldProps("type")}
                                        />
                                    </InputGroup>
                                </Form.Group>
                                <Form.Group className = "mb-3">
                                    <Form.Label>Data Point Unit</Form.Label>
                                    <InputGroup hasValidation>
                                        <Form.Control
                                            id = "unit"
                                            placeholder = "Enter data point unit"
                                            isInvalid = {!!formik.errors.unit}
                                            {...formik.getFieldProps("datapoint")}
                                        />
                                        <Form.Control.Feedback type = "unit">
                                            {formik.errors.unit}
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                </Form.Group>
                                <Form.Group className = "mb-3">
                                    <Form.Label>Register Type</Form.Label>
                                    <InputGroup hasValidation>
                                        <Form.Select
                                            id = "regtype"
                                            placeholder = "Enter register type"
                                            isInvalid = {!!formik.errors.regtype}
                                            {...formik.getFieldProps("regtype")}
                                        />
                                    </InputGroup>
                                </Form.Group>
                            </Modal.Body>
                            <Modal.Footer className = "d-flex flex-column">
                                {success || error  ? (
                                    <Row>
                                        <Col className = "d-flex flex-column align-items-center">
                                            {success ? (
                                                <>
                                                    <FaCheck/>
                                                    Operation was successful
                                                </>
                                            ) : (
                                                <>
                                                    <Row className = "mb-2">
                                                        <Col className="d-flex flex-row gap-2 align-items-center">
                                                            <FaExclamation/>
                                                            An error occured. Please try again.
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col>
                                                            <Button
                                                                variant ="primary"
                                                                onClick = {(e) => {
                                                                    e.preventDefault();
                                                                    resetAll();
                                                                }}
                                                            >
                                                                Try Again
                                                            </Button>
                                                        </Col>
                                                    </Row>
                                                </>
                                            )}
                                        </Col>
                                    </Row>
                                ) : (
                                    <>
                                        {isConfirm ? (
                                            <Row className = "mb-3">
                                                <Col>{"Are you sure you wish to add this model"}</Col>
                                            </Row>
                                        ): null}
                                        <Row>
                                            <Col className = "d-flex flex-row gap-4 justify-content-center align-items-center mx-auto">
                                                {isConfirm ? (
                                                    <>
                                                        <Button
                                                            type = "submit"
                                                            variant = "primary"
                                                            className={
                                                                "d-flex flexx-row align-items-center gap-2"
                                                            }
                                                        >
                                                            <faPlus/>
                                                            Add
                                                        </Button>
                                                        <Button
                                                            variant="secondary"
                                                            className="d-flex flex-row align-items-center gap-2 text-white"
                                                            onClick={(e) => {
                                                              e.preventDefault();
                                                              setIsConfirm(false);
                                                            }}
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </>
                                                ): (
                                                    <>
                                                        <Button
                                                        variant="primary"
                                                        className="d-flex flex-row align-items-center gap-2"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setIsConfirm(true);
                                                        }}
                                                        >
                                                        <FaPlus />
                                                        Add
                                                        </Button>
                                                    </>
                                                )}
                                            </Col>
                                        </Row>
                                    </>

                                )}

                            </Modal.Footer>
                        </Form>
                    </>
                )}
            </Formik>
        </Modal>
    );
}

MeterModelAddModal.propTypes = {
    show: PropTypes.bool,
    handleClose: PropTypes.func,
    handleSubmit: PropTypes.func,
};

export default MeterModelAddModal;