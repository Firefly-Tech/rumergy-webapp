import { React, useState } from "react";
import PropTypes from "prop-types";
import { Row, Col, Card, Form } from "react-bootstrap";
import DateTimePicker from "react-datetime-picker/dist/DateTimePicker";

function DLSDateEnd(props){
    const [value, onChange] = useState(new Date());

    return(
        <Card className = "DLS-card mb-sm-3 flex-fill">
            <Card.Title className = "d-flex flex-row align-self-start px-3 pt-2">
                <h4 className = "bold mb-0">Date End</h4>
            </Card.Title>
            <Card.Body>
                <DateTimePicker
                onChange={onChange}
                value={value}
                />
            </Card.Body>

        </Card>

    );




}

export default DLSDateEnd;