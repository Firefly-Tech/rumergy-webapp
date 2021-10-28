import { React, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Col, Row, Modal, Button, Spinner } from "react-bootstrap";
import DashboardMeterSelect from "./DashboardMeterSelect";
import DashboardSelectedMeters from "./DashboardSelectedMeters";
import DashboardVisualization from "./DashboardVisualization";

const testMeterList = [
  { id: 1, name: "Stefani 1" },
  { id: 2, name: "Chardon 1" },
  { id: 3, name: "Stefani 2" },
];

const testData = {
  labels: [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  ],
  datasets: [
    {
      label: "# of Votes",
      data: [
        12, 19, 3, 5, 2, 3, 12, 19, 32, 5, 2, 3, 12, 198, 3, 5, 2, 3, 2, 3,
      ],
      fill: false,
      backgroundColor: "rgb(0, 79, 45)",
      borderColor: "rgba(0, 79, 45, 0.2)",
    },
  ],
};
const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

function Dashboard(props) {
  const [meterList, setMeterList] = useState([]);
  const [meterNames, setMeterNames] = useState([]);
  const [meterData, setMeterData] = useState({});
  const [meterIDList, setMeterIDList] = useState([]);
  const [selectedTimeframe, setSelectedTimeframe] =
    useState(DAY_IN_MILLISECONDS);
  const [selectedDatatype, setSelectedDatatype] = useState("consumption");
  const [selectedMeters, setSelectedMeters] = useState([]);

  const [show, setShow] = useState(false);
  const [errorName, setErrorName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [loading, setLoading] = useState(false);

  /* HOOKS */

  useEffect(() => {
    var idList = meterList
      .filter((meter) => {
        return selectedMeters.includes(meter.name);
      })
      .map((meter) => {
        return meter.id;
      });
    setMeterIDList(idList);
  }, [selectedMeters]);

  // TODO: Add meter list fetch here
  useEffect(() => {
    setMeterList(testMeterList);
    setMeterNames(
      meterList.map((meter) => {
        return meter.name;
      })
    );
  }, [meterList]);

  /* METER LIST HANDLERS */

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

  /* ERROR MODAL HANDLERS */
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  /* METER DATA FETCH HANDLERS/HELPERS*/
  const handleFetch = () => {
    if (!(selectedMeters.length > 0)) {
      handleShow();
      setErrorName("No meters selected");
      setErrorMessage("Select at least one meter to sync the data.");
    } else fetchData();
  };

  // TODO: Add data fetch here
  const fetchData = () => {
    setLoading(true);

    const getLabel = () => {
      return selectedDatatype === "consumption" ? "Consumption" : "Demand";
    };

    var startingDateTime = new Date(
      Date.now() - selectedTimeframe
    ).toISOString();

    // TODO: Add axis labels
    const data = {
      labels: [],
      datasets: [
        {
          label: getLabel(),
          data: [],
          fill: false,
          backgroundColor: "rgb(0, 79, 45)",
          borderColor: "rgba(0, 79, 45, 0.2)",
        },
      ],
    };

    if (meterIDList.length > 1) {
      // Multiple meters
      //consumption
      //demand
    } else {
      // Single meter
      //consumption
      //demand
    }

    data.labels = testData.labels;
    data.datasets[0].data = testData.datasets[0].data;

    setMeterData(data);
    setLoading(false);
  };

  return (
    <>
      <Row className="h-100">
        <Col className="d-flex flex-column px-4 pt-4">
          <Row>
            <Col
              sm={12}
              className="d-flex flex-row align-items-center pb-4 gap-4"
            >
              <h1 className="bold mb-0">Dashboard</h1>
              {loading && <Spinner variant="secondary" animation="border" />}
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
                handleFetch={handleFetch}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <Modal centered size="lg" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            <h4 className="bold">{errorName}</h4>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{errorMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Okay
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

Dashboard.propTypes = {};

export default Dashboard;
