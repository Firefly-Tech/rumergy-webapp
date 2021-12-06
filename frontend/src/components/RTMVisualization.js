import { React, useState } from "react";
import PropTypes from "prop-types";
import {
  Card,
  Row,
  Col,
  Form,
} from "react-bootstrap";
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import { Line } from "react-chartjs-2";
import "chartjs-adapter-date-fns";

/*<DropdownButton id="dropdown-basic-button" title={name1}>
              <Dropdown.Item eventKey="option-1">option-1</Dropdown.Item>
              <Dropdown.Item as="button"><div onClick={(e) => name1 = (e.target.textContent)}>Test</div></Dropdown.Item>
              <Dropdown.Item eventKey="option-1">option-2</Dropdown.Item>
              <Dropdown.Item eventKey="option-1">option-3</Dropdown.Item>
            </DropdownButton>*/

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
          minUnit: "minute",
          round: "minute",
          unit: "hour",
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
          // text: selectedDataPoint.unit,
        },
      },
    },
    plugins: {
      decimation: decimationPlugin,
    },
  };

  // var name1 = "Select a meter";
  /**
   * Meters dropdown menu
   *
   * @constant {object} meters
   * */
  const meters = props => 
    <select>{
      props.meterList.map( (x,y) => 
        <option key={y}>{x}</option> )
    }</select>;

   /**
   * DataPoints dropdown menu
   *
   * @constant {object} dataPoints
   * */
    const dataPoints = props => 
    <select>{
      props.selectedDataPoint.name.map( (x,y) => 
        <option key={y}>{x}</option> )
    }</select>;

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
            <div className="align">
              <Form.Select aria-label="Default select example">
                onChange={e => {
                  console.log("e.target.key", e.target.key);
                }}
               <option>Select a meter</option>
               <option value="1">1</option>
               <option value="2">2</option>
               <option value="3">3</option>
              </Form.Select>
            </div>
          </Col>
          <Col className="d-flex px-3 align-items-sm-center justify-content-end">
            <select id = "dropdown">
              onChange={e => {
                console.log("e.target.value", e.target.value);
              }}
              <option value="Initial">Select a datapoint</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
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

RTMVisualization.propTypes = {
  /** List of meters */
  meterList: PropTypes.array,
  /** Data for the selected meter, according to selected parameter. */
  data: PropTypes.object,
};

export default RTMVisualization;
