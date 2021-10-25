import { React, useState } from "react";
import PropTypes from "prop-types";
import { Col, Row } from "react-bootstrap";
import DLSBuildingSelect from "./DLSBuidingSelect";

function DataLoggingScheduler(props){






    return(
        <div className = "dataLoggingScheduler-container">
            <Row>
                <Col xs={12}>
                    <div className="section-header">
                        <h1 className = "bold">Data Logging Scheduler</h1>
                    </div>
                </Col>
            </Row>
            <Row className = "flex-grow-1">
                <Col xs={3} className="d-flex flex-column">
                    <div className = "my-auto">
                        <DLSBuildingSelect/>
                    </div>
                </Col>
            </Row>
        </div>



    );


}




DataLoggingScheduler.propTypes = {};

export default DataLoggingScheduler;