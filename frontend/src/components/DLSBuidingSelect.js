import { React, useState } from "react";
import PropTypes from "prop-types";
import { Row, Col, Card, Form } from "react-bootstrap";

function DLSBuildingSelect(props){


    return (
        <Card className = "DLS-card mb-sm-4 flex-fill">
            <Card.Title className = "d-flex flex-row align-self-start px-3 pt-2">
                <h4 className = "bold mb-0">Building</h4>
            </Card.Title>
            <Card.Body className = "building-content"> 
                <Form.Select aria-label="Default select">
                <option>Choose Building</option>
                <option value="1">This</option>
                <option value="2">Is</option>
                <option value="3">A Test</option>
                </Form.Select>

        
            </Card.Body>
        </Card>
        
    );


}

export default DLSBuildingSelect;