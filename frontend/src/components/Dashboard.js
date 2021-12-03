import { React, useEffect, useState, useCallback } from "react";
import { Col, Row, Spinner } from "react-bootstrap";
import DashboardMeterSelect from "./DashboardMeterSelect";
import DashboardSelectedMeters from "./DashboardSelectedMeters";
import DashboardVisualization from "./DashboardVisualization";
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
 * Dashboard component
 *
 * Manages visualization of consumption and
 * demand data for the meters.
 * */
function Dashboard() {
  const [meterList, setMeterList] = useState([]);
  const [meterBuffer, setMeterBuffer] = useState([]);
  const [meterData, setMeterData] = useState(emptyDataSet);
  const [selectedTimeframe, setSelectedTimeframe] = useState(1);
  const [selectedDatatype, setSelectedDatatype] = useState("consumption");
  const [selectedMeters, setSelectedMeters] = useState([]);

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
     * @memberof Dashboard
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
     *@memberof Dashboard
     **/
    setMeterBuffer(
      meterList.map((meter) => {
        return { id: meter.id, name: meter.name };
      })
    );
  }, [meterList]);

  useEffect(() => {
    /**
     * Triggers a debounced data fetch upon change of
     * any of the parameters.
     *
     *@param {object} selectedMeters
     *@param {string} selectedDatatype
     *@param {number} selectedTimeframe
     *@memberof Dashboard
     * */
    debounceCallback(handleFetch);
  }, [selectedMeters, selectedDatatype, selectedTimeframe]);

  /* METER LIST HANDLERS */

  /**
   * Adds given meter to selected meter list.
   * Also checks that at most 5 meters are in the
   * list at a time.
   *
   * @function selectMeter
   * @param {object} meter
   * */
  const selectMeter = (meter) => {
    // Max 5 meters at a time
    if (selectedMeters.length >= 5) {
      setErrorName("Maximum number of meters reached");
      setErrorMessage("Can only select 5 meters at a time.");
      handleShow();
      return;
    }

    setSelectedMeters([...selectedMeters, meter]);
    setMeterBuffer(
      meterBuffer.filter((bufferMeter) => bufferMeter.id !== meter.id)
    );
  };

  /**
   * Debounced version of the select meter function
   *
   * @function selectMeterDebounced
   * @param {object} meter - Meter object
   **/
  const selectedMeterDebounced = (meter) => {
    debounceCallback(() => selectMeter(meter));
  };

  /**
   * Deselects the provided meter
   *
   * @function deselectMeter
   * @param {object} meter - Meter object
   * */
  const deselectMeter = (meter) => {
    setSelectedMeters(
      selectedMeters.filter((selectedMeter) => selectedMeter.id !== meter.id)
    );
    setMeterBuffer([...meterBuffer, meter]);
  };

  /**
   * Debounced version of the deselect meter function
   *
   * @function deselectMeterDebounced
   * @param {object} meter - Meter object
   **/
  const deselectMeterDebounced = (meter) => {
    debounceCallback(() => deselectMeter(meter));
  };

  /**
   * Clears all selected meters
   *
   * @function clearSelected
   * @public
   **/
  const clearSelected = () => {
    setMeterBuffer([...meterBuffer, ...selectedMeters]);
    setSelectedMeters([]);
  };

  /* ERROR MODAL HANDLERS */
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  /**
   * Handles fetching the meter data with all the selected parameters
   *
   * @function handleFetch
   * */
  const handleFetch = () => {
    if (!(selectedMeters.length > 0) && !initialLoad) {
      setMeterData(emptyDataSet);
      setErrorName("No meters selected");
      setErrorMessage("Select at least one meter to sync the data.");
      handleShow();
    } else fetchData();
  };

  /**
   * Handles fetching the meter list
   * with the selected parameters.
   *
   * @function fetchData
   * @async
   **/
  const fetchData = async () => {
    setLoading(true);

    const datatypeLabel =
      selectedDatatype === "consumption" ? "Consumption" : "Demand";

    var startingDateTime = formatISO(
      sub(new Date(Date.now()), { days: selectedTimeframe })
    );

    let data = {
      datasets: [],
    };

    for (var i = 0; i < selectedMeters.length; i++) {
      const meter = selectedMeters[i];

      let tempMeterData = await axios
        .get(
          `${auth.apiHost}/api/meters/${meter.id}/meter_data_by_time_frame`,
          {
            params: {
              start: startingDateTime,
              data_type: selectedDatatype,
            },
          }
        )
        .then((res) => {
          return res.data.map((meterDataObj) => {
            return {
              x: getTime(parseISO(meterDataObj.timestamp)),
              y: meterDataObj.avg,
            };
          });
        })
        .catch(() => {
          setErrorName("Data fetch error");
          setErrorMessage(`Failed to fetch data for meter: ${meter.name}`);
          handleShow();
          return null;
        });
      if (!tempMeterData) {
        data = emptyDataSet;
        break;
      }
      data.datasets.push({
        label: `${meter.name} ${datatypeLabel}`,
        data: tempMeterData,
        fill: false,
        backgroundColor: lineColors[i],
        borderColor: lineColorsTransparent[i],
      });
    }

    if (!data.datasets.length) data = emptyDataSet;

    setLoading(false);
    setMeterData(data);
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
              <h1 className="bold mb-0">Dashboard</h1>
              {loading && <Spinner variant="secondary" animation="border" />}
            </Col>
          </Row>
          <Row className="flex-grow-1">
            <Col sm={3} className="d-flex flex-column justify-content-evenly">
              <DashboardMeterSelect
                meterList={meterBuffer}
                selectMeter={selectedMeterDebounced}
              />
              <DashboardSelectedMeters
                selectedMeters={selectedMeters}
                deselectMeter={deselectMeterDebounced}
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
      <ErrorModal
        show={show}
        handleClose={handleClose}
        errorMessage={errorMessage}
        errorName={errorName}
      />
    </>
  );
}

export default Dashboard;
