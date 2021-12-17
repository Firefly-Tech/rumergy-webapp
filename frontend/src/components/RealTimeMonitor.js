import { React, useEffect, useState, useRef, useCallback } from "react";
import { Col, Row, Spinner } from "react-bootstrap";
import RTMVisualization from "./RTMVisualization";
import ErrorModal from "./ErrorModal";
import { sub, formatISO, getTime, parseISO } from "date-fns";
import { useRequireAuth } from "../resources/use-require-auth";
import axios from "axios";
import { roles } from "../resources/constants";
import { setIn } from "formik";

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

const maxTimeout = 1 * 60 * 1000;
const fetchInterval = 2 * 1000;

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
  const chartRef = useRef(null);

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
          return {
            id: dataPoint.id,
            name: dataPoint.name,
            units: dataPoint.unit,
          };
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
      let meterName = meterList.filter((meter) => meter.id === selectedMeter)[0]
        .name;
      setMeterData({
        datasets: [
          {
            label: `${meterName} live data`,
            data: [],
            fill: false,
            backgroundColor: lineColors[0],
            borderColor: lineColorsTransparent[0],
          },
        ],
      });

      let id = setInterval(fetchData, fetchInterval);
      let timeoutID = setTimeout(() => {
        setErrorName("Live reading timeout reached");
        setErrorMessage(
          `Live readings can only go on for ${
            maxTimeout / (60 * 1000)
          } minutes. Please select a meter to start reading again.`
        );
        handleShow();
        setSelectedMeter(-1);
        setSelectedDataPoint(-1);
      }, maxTimeout);

      return () => {
        clearInterval(id);
        clearTimeout(timeoutID);
      };
    }
  }, [selectedMeter, selectedDataPoint]);

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
    await auth.userAxiosInstance
      .get(`${auth.apiHost}/api/meters/${selectedMeter}/live_reading`, {
        params: { datapoint: selectedDataPoint },
      })
      .then((res) => {
        let value = parseInt(res.data.value);
        let timestamp = getTime(parseISO(res.data.timestamp));

        addData(chartRef.current, { x: timestamp, y: value });
      })
      .catch(() => {
        setErrorName("Failed to get data");
        setErrorMessage(
          "An error occurred while reading the meter's data. Please try again."
        );
        handleShow();
        setDataPointList([]);
        setSelectedMeter(-1);
        setSelectedDataPoint(-1);
      });
  };

  const addData = (chart, data) => {
    chart.data.datasets[0].data.push(data);
    chart.update();
  };

  const getUnits = () => {
    if (selectedDataPoint !== -1 && dataPointList.length) {
      return dataPointList.filter(
        (dataPoint) => dataPoint.id === selectedDataPoint
      )[0].units;
    }
    return "";
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
                chartRef={chartRef}
                units={getUnits()}
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
