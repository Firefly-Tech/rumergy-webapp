import { React, useEffect, useState } from "react";
import { Col, Row, Spinner } from "react-bootstrap";
import DashboardMeterSelect from "./DashboardMeterSelect";
import DashboardSelectedMeters from "./DashboardSelectedMeters";
import DashboardVisualization from "./DashboardVisualization";
import ErrorModal from "./ErrorModal";
import { sub, formatISO, getTime, parseISO } from "date-fns";
import { useAuth } from "../resources/use-auth";
import axios from "axios";

const lineColors = [
  "rgb(255, 99, 132)",
  "rgb(255, 159, 64)",
  "rgb(75, 192, 192)",
  "rgb(54, 162, 235)",
  "rgb(153, 102, 255)",
];
const lineColorsTransparent = [
  "rgba(255, 99, 132, 0.2)",
  "rgba(255, 159, 64, 0.2)",
  "rgba(75, 192, 192, 0.2)",
  "rgba(54, 162, 235, 0.2)",
  "rgba(153, 102, 255, 0.2)",
];

function Dashboard() {
  const [meterList, setMeterList] = useState([]);
  const [meterBuffer, setMeterBuffer] = useState([]);
  const [meterData, setMeterData] = useState({});
  const [selectedTimeframe, setSelectedTimeframe] = useState(1);
  const [selectedDatatype, setSelectedDatatype] = useState("consumption");
  const [selectedMeters, setSelectedMeters] = useState([]);

  const [show, setShow] = useState(false);
  const [errorName, setErrorName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const auth = useAuth();

  /* HOOKS */

  useEffect(async () => {
    setLoading(true);
    await axios
      .get(`${auth.apiHost}/api/meters`, {
        headers: { Authorization: await auth.withAppUser() },
        params: { status: "ACT" },
      })
      .then((res) => {
        setMeterList(res.data);
      })
      .catch((error) => {
        setMeterList([]);
        setErrorName("Fetch Error");
        setErrorMessage("Failed to fetch active meter list.");
        handleShow();
      });
    setLoading(false);
  }, [auth]);

  useEffect(() => {
    setMeterBuffer(
      meterList.map((meter) => {
        return { id: meter.id, name: meter.name };
      })
    );
  }, [meterList]);

  /* METER LIST HANDLERS */

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
  const deselectMeter = (meter) => {
    setSelectedMeters(
      selectedMeters.filter((selectedMeter) => selectedMeter.id !== meter.id)
    );
    setMeterBuffer([...meterBuffer, meter]);
  };
  const clearSelected = () => {
    setMeterBuffer([...meterBuffer, ...selectedMeters]);
    setSelectedMeters([]);
  };

  /* ERROR MODAL HANDLERS */
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  /* METER DATA FETCH HANDLERS/HELPERS*/
  const handleFetch = () => {
    if (!(selectedMeters.length > 0)) {
      setErrorName("No meters selected");
      setErrorMessage("Select at least one meter to sync the data.");
      handleShow();
    } else fetchData();
  };

  // TODO: Add data fetch here
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

      let meterData = await axios
        .get(
          `${auth.apiHost}/api/meters/${meter.id}/meter_data_by_time_frame`,
          {
            headers: { Authorization: await auth.withAppUser() },
            params: {
              start: startingDateTime,
              data_type: selectedDatatype,
            },
          }
        )
        .then((res) => {
          return res.data.map((meterDataObj, index) => {
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
      if (!meterData) {
        data = {};
        break;
      }
      data.datasets.push({
        label: `${meter.name} ${datatypeLabel}`,
        data: meterData,
        fill: false,
        backgroundColor: lineColors[i],
        borderColor: lineColorsTransparent[i],
      });
    }

    setLoading(false);
    setMeterData(data);
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
                meterList={meterBuffer}
                selectMeter={selectMeter}
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
