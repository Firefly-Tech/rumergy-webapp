import { React, useState } from "react";
import PropTypes from "prop-types";
import { Card, Row, Col, Form } from "react-bootstrap";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-date-fns";

/**
 * Decimation plugin options.
 * Handles data decimation on chart.
 *
 * @constant {object} decimation
 * */
const decimationPlugin = {
  enabled: true,
  algorithm: "lttb",
  samples: 200,
};

function RTMVisualization(props) {
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
          minUnit: "second",
          round: "second",
          unit: "second",
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
          text: props.units,
        },
      },
    },
    plugins: {
      decimation: decimationPlugin,
    },
  };

  return (
    <Card as={Row} className="RTM-data-visualization-card mb-sm-4 h-100">
      <Col>
        <Card.Body as={Row}>
          <Card.Title as={Col} className="px-3 pt-3">
            <h4 className="bold">Data Visualization</h4>
          </Card.Title>
        </Card.Body>
        <Card.Body as={Row} className="pt-sm-0">
          <Col className="d-flex px-3 align-items-sm-center justify-content-start">
            <Form.Select
              aria-label="Default select example"
              value={props.selectedMeter}
              onChange={(e) => {
                props.setSelectedMeter(parseInt(e.target.value));
                props.setSelectedDataPoint(-1);
              }}
            >
              <option value={-1} defaultValue>
                Select a meter
              </option>
              {props.meterList.map((meter, index) => (
                <option value={meter.id} key={index}>
                  {meter.name}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col className="d-flex px-3 align-items-sm-center justify-content-end">
            <Form.Select
              aria-label="Default select example"
              value={props.selectedDataPoint}
              onChange={(e) =>
                props.setSelectedDataPoint(parseInt(e.target.value))
              }
              disabled={props.selectedMeter < 0 || !props.dataPointList.length}
            >
              <option value={-1} defaultValue>
                Select a data point
              </option>
              {props.dataPointList.map((dataPoint, index) => (
                <option value={dataPoint.id} key={index}>
                  {dataPoint.name}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Card.Body>
        <Card.Body as={Row} className="">
          <Col
            className={`d-flex flex-column chart mx-3 mt-4 justify-content-center flex-grow-1 chart-bg-color`}
          >
            <Line data={props.data} options={options} ref={props.chartRef} />
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
        <Card.Footer>
          <span>
            <b>Note</b>: Time is given in UTC.
          </span>
        </Card.Footer>
      </Col>
    </Card>
  );
}

RTMVisualization.propTypes = {
  /** List of meters */
  meterList: PropTypes.array,
  dataPointList: PropTypes.array,
  /** Data for the selected meter, according to selected parameter. */
  data: PropTypes.object,
  setSelectedMeter: PropTypes.func,
  selectedMeter: PropTypes.number,
  setSelectedDataPoint: PropTypes.func,
  selectedDataPoint: PropTypes.number,
  chartRef: PropTypes.object,
  units: PropTypes.string,
};

export default RTMVisualization;
