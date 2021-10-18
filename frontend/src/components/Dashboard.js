import { React, useState } from "react";
import PropTypes from "prop-types";
import { Col, Row } from "react-bootstrap";
import DashboardMeterSelect from "./DashboardMeterSelect";
import DashboardSelectedMeters from "./DashboardSelectedMeters";

function Dashboard(props) {
  const [meterList, setMeterList] = useState({}); // Available meters, name keys
  const [selectedMeters, setSelectedMeters] = useState(["test"]); // List of selected meters

  const selectMeter = (name) => {
    setSelectedMeters([...selectedMeters, name]);
  };

  const deselectMeter = (name) => {
    setSelectedMeters(selectedMeters.filter((meterName) => meterName !== name));
  };

  // TODO: meter list fetch, get meter data req

  return (
    <div className="dashboard-container">
      <Row>
        <Col xs={12}>
          <div className="section-header">
            <h1>Dashboard</h1>
          </div>
        </Col>
      </Row>
      <Row>
        <Col xs={3}>
          <DashboardMeterSelect />
          <DashboardSelectedMeters
            selectedMeters={selectedMeters}
            deselectMeter={deselectMeter}
          />
        </Col>
      </Row>
    </div>
  );
}

Dashboard.propTypes = {};

export default Dashboard;
