import { React, useState } from "react";
import PropTypes from "prop-types";
import { Row, Col, Card, Form } from "react-bootstrap";

function DLSDataPoints(props){



    return(
        <Card className = "DLS-card mb-sm-3 flex-fill">
            <Card.Title className = "d-flex flex-row align-self-start px-3 pt-2">
                <h4 className = "bold mb-0">Data Points</h4>
            </Card.Title>
            <Card.Body className = "building-content"> 
                <Form.Group className="px-3" id="formGridCheckbox">
                    <Form.Check type="checkbox" label="Consumption" />
                    <Form.Check type="checkbox" label="Demand" />
                </Form.Group>
            </Card.Body>
        </Card>


    );
}
export default DLSDataPoints;