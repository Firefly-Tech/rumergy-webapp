import { React, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Col, Row } from "react-bootstrap";

function DataLogs(props){

    return(
        <Row className = "h-100">
            <Col className="d-flex-column px-4 pt-4">
                <Row>
                    <Col sm={12} className="pb-4">
                        <h1 className = "bold">Data Logs</h1>
                    </Col>
                </Row>
                <Row className = "flex-grow-1">
                    <Col xs={3} className="d-flex flex-column">
                        <div className = "my-auto">
                                    
                        </div>
                    </Col>
                </Row>
            </Col>
        </Row>



    );

}

DataLogs.propTypes = {};

export default DataLogs;