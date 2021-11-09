import { React, useState } from "react";
import PropTypes from "prop-types";
import {
  Card,
  Row,
  Col,
  ToggleButtonGroup,
  ToggleButton,
  Button,
} from "react-bootstrap";
import { Line } from "react-chartjs-2";
import { FaSync } from "react-icons/fa";

const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;
const timeframeRadios = [
  { name: "24h", value: DAY_IN_MILLISECONDS },
  { name: "7d", value: 7 * DAY_IN_MILLISECONDS },
  { name: "30d", value: 30 * DAY_IN_MILLISECONDS },
];
const datatypeRadios = [
  { name: "Consumption", value: "consumption" },
  { name: "Demand", value: "demand" },
];

const options = {
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

function DashboardVisualization(props) {
  return (
    <Card as={Row} className="dashboard-data-visualization-card mb-sm-4 h-100">
      <Col>
        <Card.Body as={Row}>
          <Card.Title as={Col} className="px-3 pt-3">
            <h4 className="bold">Data Visualization</h4>
          </Card.Title>
        </Card.Body>
        <Card.Body as={Row} className="pt-sm-0">
          <Col className="d-flex px-3 align-items-sm-center justify-content-start">
            <ToggleButtonGroup
              type="radio"
              value={props.selectedTimeframe}
              size="md"
              name="timeframe"
              defaultValue={DAY_IN_MILLISECONDS}
              onChange={(val) => props.setSelectedTimeframe(val)}
            >
              {timeframeRadios.map((radio, idx) => (
                <ToggleButton
                  key={idx}
                  variant="primary"
                  id={`tf-radio-${idx}`}
                  value={radio.value}
                  className="timeframe-button"
                >
                  {radio.name}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Col>
          <Col className="d-flex px-5 align-items-sm-center justify-content-end">
            <ToggleButtonGroup
              type="radio"
              value={props.selectedDatatype}
              size="md"
              name="datatype"
              defaultValue={"consumption"}
              onChange={(val) => props.setSelectedDatatype(val)}
            >
              {datatypeRadios.map((radio, idx) => (
                <ToggleButton
                  key={idx}
                  variant="primary"
                  id={`dt-radio-${idx}`}
                  value={radio.value}
                  className="timeframe-button"
                >
                  {radio.name}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Col>
        </Card.Body>
        <Card.Body as={Row} className="">
          <Col
            className={`chart mx-3 mt-4 justify-content-center flex-grow-1 ${
              Object.keys(props.data).length > 0 ? "chart-bg-color" : ""
            }`}
          >
            {Object.keys(props.data).length === 0 ? (
              <h5 className="text-center py-3 my-auto">No data</h5>
            ) : (
              <Line data={props.data} options={options} />
            )}
          </Col>
        </Card.Body>
        <Card.Body as={Row}>
          <Col className="d-flex justify-content-center">
            <Button
              className="d-flex flex-row align-items-center gap-3"
              variant="primary"
              size="md"
              onClick={props.handleFetch}
            >
              <FaSync className="fs-5" />
              <span>Sync</span>
            </Button>
          </Col>
        </Card.Body>
      </Col>
    </Card>
  );
}

DashboardVisualization.propTypes = {
  selectedTimeframe: PropTypes.number,
  selectedDatatype: PropTypes.string,
  setSelectedDatatype: PropTypes.func,
  setSelectedTimeframe: PropTypes.func,
  data: PropTypes.object,
  handleFetch: PropTypes.func,
};

export default DashboardVisualization;
