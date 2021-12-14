import { React } from "react";
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
import "chartjs-adapter-date-fns";

/**
 * Data for timeframe selectors
 *
 * @constant {array} timeframeRadios
 * */
const timeframeRadios = [
  { name: "24h", value: 1 },
  { name: "7d", value: 7 },
  { name: "30d", value: 30 },
];
/**
 * Data for datatype selectors
 *
 * @constant {array} datatypeRadios
 * */
const datatypeRadios = [
  { name: "Consumption", value: "consumption" },
  { name: "Demand", value: "demand" },
];

/**
 * Decimation plugin options.
 * Handles data decimation on chart.
 *
 * @constant {object} decimation
 * */
const decimationPlugin = {
  enabled: true,
  algorithm: "lttb",
  samples: 100,
  threshold: 100,
};

function DashboardVisualization(props) {
  /**
   * Helper to set chart x-axis unit.
   *
   * @function setUnit
   * @returns {string}
   * */
  const setUnit = () => {
    if (props.selectedTimeframe === 1) return "hour";
    return "day";
  };

  /**
   * Chart configuration
   *
   * @constant {object} options
   * */
  const options = {
    parsing: false,
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
    scales: {
      x: {
        type: "time",
        time: {
          minUnit: "minute",
          round: "minute",
          unit: setUnit(),
        },
        ticks: {
          source: "auto",
          autoSkip: true,
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: props.selectedDatatype === "consumption" ? "kWh" : "kW",
        },
      },
    },
    plugins: {
      decimation: decimationPlugin,
    },
  };

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
              defaultValue={1}
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
            className={`d-flex flex-column chart mx-3 mt-4 justify-content-center flex-grow-1 chart-bg-color`}
          >
            <Line data={props.data} options={options} />
            <div className="text-center">
              <h5 className="bold">
                {props.data.datasets.length === 1 &&
                props.data.datasets[0].label === "No data"
                  ? "No data"
                  : null}
              </h5>
            </div>
          </Col>
        </Card.Body>
      </Col>
    </Card>
  );
}

DashboardVisualization.propTypes = {
  /** Selected timeframe for the visualization. Indicates number of days (1, 7, or 30). */
  selectedTimeframe: PropTypes.number,
  /** Selected datatype. Can be consumption or demand. */
  selectedDatatype: PropTypes.string,
  setSelectedDatatype: PropTypes.func,
  setSelectedTimeframe: PropTypes.func,
  /** Data for the selected meters, according to selected parameters. */
  data: PropTypes.object,
};

export default DashboardVisualization;
