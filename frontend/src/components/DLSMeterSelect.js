import { React, useState } from "react";
import PropTypes from "prop-types";
import { Row, Col, Card, Form } from "react-bootstrap";

function DLSMeterSelect(props){


    return(
        <Card className = "DLS-card mb-sm-3 flex-row">
            <Card.Title className = "d-flex flex-row align-self-center px-3 pt-2">
                <h4 className = "bold mb-0">Meter</h4>
            </Card.Title>
            <Card.Body className = "building-content">
                <Form.Select aria-label="Default select">
                    <option>Choose Meter</option>
                    <option value="1">This</option>
                    <option value="2">Is</option>
                    <option value="3">A Test</option>
                    
                </Form.Select>
            </Card.Body>

        </Card>



    );
}

export default DLSMeterSelect;