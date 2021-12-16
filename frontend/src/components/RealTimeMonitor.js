import { React, useEffect, useState, useCallback } from "react";
import { Col, Row, Spinner } from "react-bootstrap";
import RTMVisualization from "./RTMVisualization";
import ErrorModal from "./ErrorModal";
import { sub, formatISO, getTime, parseISO, set } from "date-fns";
import { useRequireAuth } from "../resources/use-require-auth";
import axios from "axios";
import { roles } from "../resources/constants";

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
  const [meterData, setMeterData] = useState(emptyDataSet);
  const [selectedMeter, setSelectedMeter] = useState(-1);

  const [dataPointList, setDataPointList] = useState([]);
  const [selectedDataPoint, setSelectedDataPoint] = useState(-1);

  const [show, setShow] = useState(false);
  const [errorName, setErrorName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const auth = useRequireAuth("/login", [roles.Advanced]);

  useEffect(() => {
    /**
     * Fetches meter list
     *
     * @param {object} auth - Authentication hook
     * @memberof RealTimeMonitor
     * */
    async function fetchMeters() {
      let data = await axios
        .get(`${auth.apiHost}/api/meters`, {
          params: { status: "ACT", ordering: "building__name" },
        })
        .then((res) => {
          return res.data;
        })
        .catch(() => {
          return [];
        });

      if (data.length) {
        data = await Promise.all(
          data.map(async (meter) => {
            let building = await axios
              .get(`${auth.apiHost}/api/buildings/${meter.building}`)
              .then((res) => {
                return res.data;
              });

            return {
              id: meter.id,
              name: `${meter.name} (${building.name})`,
              model: meter.meter_model,
            };
          })
        );
      } else {
        setErrorName("No meters found");
        setErrorMessage(
          "No active meters are available right now. Please try again later."
        );
        handleShow();
      }

      setMeterList(data);
    }

    setLoading(true);
    fetchMeters();
    setLoading(false);
  }, [auth]);

  useEffect(() => {
    async function fetchDataPoints() {
      let meterModel = meterList.filter(
        (meter) => meter.id === selectedMeter
      )[0].model;

      let data = await auth.userAxiosInstance
        .get(`${auth.apiHost}/api/data-points`, {
          params: { model: meterModel },
        })
        .then((res) => {
          return res.data;
        })
        .catch(() => {
          setErrorName("Failed to get data points");
          setErrorMessage(
            "An error occurred while trying to get the data points for the selected meter. Please try again."
          );
          handleShow();
          setDataPointList([]);
          setSelectedMeter(-1);
        });

      setDataPointList(
        data.map((dataPoint) => {
          return { id: dataPoint.id, name: dataPoint.name };
        })
      );
    }

    if (selectedMeter !== -1) {
      setLoading(true);
      fetchDataPoints();
      setLoading(false);
    }
  }, [selectedMeter, meterList, auth]);

  useEffect(() => {
    if (selectedMeter !== -1 && selectedDataPoint !== -1) {
      // Start reading
    } else {
      // Stop timer (?)
    }
  }, [selectedMeter, selectedDataPoint])

  /* ERROR MODAL HANDLERS */
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  /**
   * Handles fetching meter readings.
   *
   * @function fetchData
   * @async
   **/
  const fetchData = async () => {};

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
                meterList={meterList}
                dataPointList={dataPointList}
                data={meterData}
                setSelectedMeter={setSelectedMeter}
                selectedMeter={selectedMeter}
                setSelectedDataPoint={setSelectedDataPoint}
                selectedDataPoint={selectedDataPoint}
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
