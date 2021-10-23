import { React, useState } from "react";
import PropTypes from "prop-types";
import { Col, Row } from "react-bootstrap";
import DashboardMeterSelect from "./DashboardMeterSelect";
import DashboardSelectedMeters from "./DashboardSelectedMeters";

function Dashboard(props) {
  const [meterList, setMeterList] = useState({}); // Available meters, name keys
  const [selectedMeters, setSelectedMeters] = useState([
    "test",
    "hey",
    "yo",
    "tesifj",
  ]); // List of selected meters

  const selectMeter = (name) => {
    setSelectedMeters([...selectedMeters, name]);
  };

  const deselectMeter = (name) => {
    setSelectedMeters(selectedMeters.filter((meterName) => meterName !== name));
  };

  const clearSelected = () => {
    setSelectedMeters([]);
  };

  // TODO: meter list fetch, get meter data req

  return (
    <Row className="pt-4 h-100">
      <Row className="flex-shrink-1">
        <Col xs={12}>
          <div className="section-header">
            <h1 className="bold">Dashboard</h1>
          </div>
        </Col>
      </Row>
      <Row className="flex-grow-1">
        <Col xs={3} className="d-flex flex-column justify-content-evenly">
          <DashboardMeterSelect />
          <DashboardSelectedMeters
            selectedMeters={selectedMeters}
            deselectMeter={deselectMeter}
            clearSelected={clearSelected}
          />
        </Col>
      </Row>
    </Row>
  );
}

Dashboard.propTypes = {};

export default Dashboard;
