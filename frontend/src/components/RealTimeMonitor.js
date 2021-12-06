import { React, useEffect, useState, useCallback } from "react";
import { Col, Row, Spinner } from "react-bootstrap";
import RTMVisualization from "./RTMVisualization";
import ErrorModal from "./ErrorModal";
import { sub, formatISO, getTime, parseISO } from "date-fns";
import { useAuth } from "../resources/use-auth";
import axios from "axios";

/** Line colors for graphs
 *
 * @constant {object} lineColors
 * */
const lineColors = [
  "rgb(255, 99, 132)",
  "rgb(255, 159, 64)",
  "rgb(75, 192, 192)",
  "rgb(54, 162, 235)",
  "rgb(153, 102, 255)",
];

/** Transparent line colors for graphs
 *
 * @constant {object} lineColorsTransparent
 * */
const lineColorsTransparent = [
  "rgba(255, 99, 132, 0.2)",
  "rgba(255, 159, 64, 0.2)",
  "rgba(75, 192, 192, 0.2)",
  "rgba(54, 162, 235, 0.2)",
  "rgba(153, 102, 255, 0.2)",
];

/** Initial empty meter data.
 * Necessary so initial empty graph will
 * render.
 *
 * @constant {object} lineColorsTransparent
 * */
const emptyDataSet = {
  datasets: [
    {
      label: "No data",
      data: [],
      fill: false,
    },
  ],
};

/**
 * Real Time Monitor component
 *
 * Manages visualization of consumption and
 * demand data for the meters.
 * */
function RealTimeMonitor() {
  const [meterList, setMeterList] = useState([]);
  const [meterBuffer, setMeterBuffer] = useState([]);
  const [meterData, setMeterData] = useState(emptyDataSet);

  const [show, setShow] = useState(false);
  const [errorName, setErrorName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  const auth = useAuth();

  useEffect(async () => {
    /**
     * Fetches meter list
     *
     * @param {object} auth - Authentication hook
     * @memberof RealTimeMonitor
     * */
    setLoading(true);
    await axios
      .get(`${auth.apiHost}/api/meters`, {
        params: { status: "ACT" },
      })
      .then((res) => {
        setMeterList(res.data);
      })
      .catch(() => {
        setMeterList([]);
        setErrorName("Fetch Error");
        setErrorMessage("Failed to fetch active meter list.");
        handleShow();
      });
    setLoading(false);
    setInitialLoad(false);
  }, [auth]);

  useEffect(() => {
    /**
     * Sets the meter buffer used by the meter item lists.
     *
     *@param {object} meterList - Full list of meters
     *@memberof RealTimeMonitor
     **/
    setMeterBuffer(
      meterList.map((meter) => {
        return { id: meter.id, name: meter.name };
      })
    );
  }, [meterList]);

  /* ERROR MODAL HANDLERS */
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  /**
   * Handles fetching meter readings.
   *
   * @function fetchData
   * @async
   **/
   const fetchData = async () => {
   };

  /**
   * Debounces the given function using timers
   *
   * @function debounce
   * @param {function} func - Function to be debounced
   * @param {number} timeout - Debounce delay in milliseconds
   * */
  const debounce = (func, timeout = 300) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
    };
  };

  /**
   * Provides callback for the debounce function
   *
   * @function debounceCallback
   * */
  const debounceCallback = useCallback(
    debounce((func) => {
      func();
    }, 175)
  );

  return (
    <>
      <Row className="h-100">
        <Col className="d-flex flex-column px-4 pt-4">
          <Row>
          <Col
              sm={12}
              className="d-flex flex-row align-items-center pb-4 gap-4"
            >
              <h1 className="bold mb-0">Real Time View</h1>
              {loading && <Spinner variant="secondary" animation="border" />}
            </Col>
          </Row>
          <Row className="flex-grow-1">
            <Col sm={10} className="d-flex flex-column px-4 pt-0">
              <RTMVisualization
                meterList={meterBuffer}
                data={meterData}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <ErrorModal
        show={show}
        handleClose={handleClose}
        errorMessage={errorMessage}
        errorName={errorName}
      />
    </>
  );
}

export default RealTimeMonitor;
