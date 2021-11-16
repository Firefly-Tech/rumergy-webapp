import { React, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Col, Row, Modal, Button } from "react-bootstrap";
import DLSBuildingSelect from "./DLSBuidingSelect";
import DLSMeterSelect from "./DLSMeterSelect";
import DLSDataPoints from "./DLSDataPoints";
import DLSTimeInterval from "./DLSTimeInterval";
import DLSDateStart from "./DLSDateStart";
import DLSDateEnd from "./DLSDateEnd";
import DLSsubmitModal from "./DLSsubmitModal";
import { FaCheck } from "react-icons/fa";
import { useRequireAuth } from "../resources/use-require-auth";
import { roles } from "../resources/constants";

function DataLoggingScheduler(props) {
  const auth = useRequireAuth("/advanced/data-logging-scheduler", [
    roles.Advanced,
  ]);

  //Modal State
  const [modalShow, setModalShow] = useState(false);

  return (
    <Row className="h-100">
      <Col className="d-flex-column px-4 pt-4">
        {/*HEADER*/}
        <Row>
          <Col sm={12} className="pb-4">
            <h1 className="bold">Data Logging Scheduler</h1>
          </Col>
        </Row>
        {/* BODY */}
        <Row className="flex-grow-1 ">
          <Col xs={10} className=" d-flex flex-column">
            <div className="my-auto">
              <DLSBuildingSelect />
              <DLSMeterSelect />
              <DLSTimeInterval />
              <DLSDateStart />
              <DLSDateEnd />
            </div>
          </Col>
          <Col
            sm={"auto"}
            className="d-flex flex-column justify-content-evenly"
          >
            <DLSDataPoints />
            <>
              <Button
                variant="primary"
                onClick={() => setModalShow(true)}
              >
                Submit
              </Button>

              <DLSsubmitModal
                show={modalShow}
                onHide={() => setModalShow(false)}
              />
            </>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

DataLoggingScheduler.propTypes = {};

export default DataLoggingScheduler;
