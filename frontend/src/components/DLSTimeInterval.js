import { React, useState } from "react";
import PropTypes from "prop-types";
import { Row, Col, Card, Form } from "react-bootstrap";

function DLSTimeInterval(props){

    return(
        <Card className = "DLS-card mb-sm-3 flex-fill">
            <Card.Title className = "d-flex flex-row align-self-start px-3 pt-2">
                <h4 className = "bold mb-0">Time Interval</h4>
            </Card.Title>
            <Card.Body className = "building-content">
                <Form>
                {['radio'].map((type) => (
                        <div key={`default-${type}`} className="mb-3">
                            <Form.Check 
                            type={type}
                            id={`Test2-${type}`}
                            label={`Test ${type}`}
                            />

                            <Form.Check 
                            type={type}
                            id={`Test1-${type}`}
                            label={`Test ${type}`}
                            />
                        </div>
                ))}
                </Form>
            </Card.Body> 
        </Card>



    );

}

export default DLSTimeInterval;