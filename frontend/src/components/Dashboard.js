import { React, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Col, Row } from "react-bootstrap";
import DashboardMeterSelect from "./DashboardMeterSelect";
import DashboardSelectedMeters from "./DashboardSelectedMeters";
import DashboardVisualization from "./DashboardVisualization";

const testMeterList = [
  { id: 1, name: "Stefani 1" },
  { id: 2, name: "Chardon 1" },
  { id: 3, name: "Stefani 2" },
];

const testData = {
  labels: ["1", "2", "3", "4", "5", "6"],
  datasets: [
    {
      label: "# of Votes",
      data: [12, 19, 3, 5, 2, 3],
      fill: false,
      backgroundColor: "rgb(255, 99, 132)",
      borderColor: "rgba(255, 99, 132, 0.2)",
    },
  ],
};
function Dashboard(props) {
  const [meterList, setMeterList] = useState([]);
  const [selectedMeters, setSelectedMeters] = useState([]);
  const [meterNames, setMeterNames] = useState([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState("24h");
  const [selectedDatatype, setSelectedDatatype] = useState("consumption");
  const [meterData, setMeterData] = useState({});

  // TODO: Add meter list fetch here
  useEffect(() => {
    setMeterList(testMeterList);
    setMeterNames(
      meterList.map((meter) => {
        return meter.name;
      })
    );
  }, [meterList]);

  // Meter list handling functions
  const selectMeter = (name) => {
    setSelectedMeters([...selectedMeters, name]);
    setMeterNames(meterNames.filter((meterName) => meterName !== name));
  };
  const deselectMeter = (name) => {
    setSelectedMeters(selectedMeters.filter((meterName) => meterName !== name));
    setMeterNames([...meterNames, name]);
  };
  const clearSelected = () => {
    setMeterNames([...meterNames, ...selectedMeters]);
    setSelectedMeters([]);
  };
  const selectAllMeters = () => {
    setSelectedMeters([...selectedMeters, ...meterNames]);
    setMeterNames([]);
  };

  // TODO: meter list fetch, get meter data req

  return (
    <Row className="h-100">
      <Col className="d-flex flex-column px-4 pt-4">
        <Row>
          <Col sm={12} className="pb-4">
            <h1 className="bold">Dashboard</h1>
          </Col>
        </Row>
        <Row className="flex-grow-1">
          <Col sm={3} className="d-flex flex-column justify-content-evenly">
            <DashboardMeterSelect
              meterList={meterNames}
              selectMeter={selectMeter}
              selectAll={selectAllMeters}
            />
            <DashboardSelectedMeters
              selectedMeters={selectedMeters}
              deselectMeter={deselectMeter}
              clearSelected={clearSelected}
            />
          </Col>
          <Col sm={9} className="d-flex flex-column justify-content-evenly">
            <DashboardVisualization
              selectedDatatype={selectedDatatype}
              selectedTimeframe={selectedTimeframe}
              setSelectedDatatype={setSelectedDatatype}
              setSelectedTimeframe={setSelectedTimeframe}
              data={meterData}
            />
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

Dashboard.propTypes = {};

export default Dashboard;
