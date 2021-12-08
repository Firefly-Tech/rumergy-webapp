import { React, useState, useEffect } from "react";
import { Col, Row, Spinner, Button } from "react-bootstrap";
import IconButton from "./IconButton";
import { FaCloudDownloadAlt } from "react-icons/fa";
import ManagementBar from "./ManagementBar";
import CustomDataTable from "./CustomDataTable";
import DataLogDetailModal from "./DataLogDetailModal";
import DataLogDownloadModal from "./DataLogDownloadModal";
import { useRequireAuth } from "../resources/use-require-auth";
import { roles } from "../resources/constants";
import { parseISO, format, isAfter } from "date-fns";

/**
 * Initial value for selectedEditEntry
 *
 * @constant {object} emptyDataLogEntry
 * */
const emptyDataLogEntry = {
  id: "",
  meter: "",
  dataPointNames: "",
  startDate: "",
  endDate: "",
  samplingRate: "",
};

/** Data log management screen for advanced users. */
function DataLogs(props) {
  const [loading, setLoading] = useState(false);
  const [dataLog, setDataLog] = useState([]);

  // Filter state
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [filteredEntries, setFilteredEntries] = useState([]);

  const [selectedEntry, setSelectedEntry] = useState(emptyDataLogEntry);

  // Detail States
  const [showDetails, setShowDetails] = useState(false);
  const handleCloseDetails = () => setShowDetails(false);
  const handleShowDetails = () => setShowDetails(true);

  //Download State
  const [showDownload, setShowDownload] = useState(false);
  const handleCloseDownload = () => setShowDownload(false);
  const handleShowDownload = () => setShowDownload(true);

  const auth = useRequireAuth("/login", [roles.Advanced]);


  useEffect(() => {
    /**
     * Fetch data log data on load.
     *
     * @memberof DataLogs
     * */
    if (auth.user) fetchDataLog();
  }, []);

  useEffect(() => {
    /**
     * Updates filtered entries if the filter text or
     * data logs list changes.
     *
     * @memberof DataLogs
     * */
    setLoading(true);
    setFilteredEntries(
      dataLog.filter((data_logs) =>
        data_logs.dataLogString
          .toLowerCase()
          .includes(filterText.split(" ").join("").toLowerCase())
      )
    );
    setLoading(false);
  }, [dataLog, filterText]);

  /**
   * Handles fetching data logs data.
   *
   * @function fetchDataLog
   * @async
   * */
  const fetchDataLog = async () => {
    setLoading(true);
    let data = await auth.userAxiosInstance
      .get(`${auth.apiHost}/api/data-logs`, { params: { user: auth.user.id } })
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        return [];
      });

    let dataLogs = [];
    if (data.length) {
      dataLogs = await Promise.all(
        data.map(async (dataLog) => {
          // Get meter data
          let meterName = await auth.userAxiosInstance
            .get(`${auth.apiHost}/api/meters/${dataLog.meter}`)
            .then((res) => {
              return res.data.name;
            });

          // Get data points data
          let dataPointNames = await Promise.all(
            dataLog.data_points.map(async (dPointId) => {
              return await auth.userAxiosInstance
                .get(`${auth.apiHost}/api/data-points/${dPointId}`)
                .then((res) => {
                  return res.data.name;
                });
            })
          );

          let startDate = format(
            parseISO(dataLog.start_date),
            "dd-MMM-yyyy H:mm:ss"
          );
          let endDate = format(
            parseISO(dataLog.end_date),
            "dd-MMM-yyyy H:mm:ss"
          );

          let dataLogStringElements = [
          // Build string with data log attributes
          // for filtering.
            meterName,
            dataPointNames.join("").split(" ").join(""),
            startDate,
            endDate,
            dataLog.sampling_rate,
          ];

          return {
            id: dataLog.id,
            dataLogString: dataLogStringElements.join("").split(" ").join(""),
            meter: meterName,
            dataPointNames: dataPointNames.join(", "),
            startDate: startDate,
            endDate: endDate,
            samplingRate: dataLog.sampling_rate,
            completed: isAfter(Date.now(), parseISO(dataLog.end_date)),
          };
        })
      );
    }
    setDataLog(dataLogs);
    setLoading(false);
  };

  /**
   * Columns for data table.
   *
   * @constant {object} columns
   * */
  const columns = [
    {
      name: "Details",
      cell: (row) => (
        <Button
          variant="link"
          onClick={() => {
            setSelectedEntry(row);
            handleShowDetails();
          }}
        >
          Details
        </Button>
      ),
      button: true,
      allowOverflow: true,
    },
    { name: "Start Date", selector: (row) => row.startDate, sortable: true },
    { name: "End Date", selector: (row) => row.endDate, sortable: true },
    { name: "Meter", selector: (row) => row.meter, sortable: true },
    {
      cell: (row) => (
        <IconButton
          icon={<FaCloudDownloadAlt className="fs-5" />}
          clickAction={() => {
            setSelectedEntry(row);
            handleShowDownload();
          }}
        />
      ),
      button: true,
    },
  ];

  /**
   * Handles the creations of the file with the data for download.
   *
   * @function downloadDataLog
   * */
  const downloadDataLog = (id) => {
    setLoading(true);
    return auth.userAxiosInstance
      .get(`${auth.apiHost}/api/data-logs/${id}/download`, {
        responseType: "blob",
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "file.csv"); //or any other extension
        document.body.appendChild(link);
        link.click();

        return true;
      })
      .catch(() => {
        return false;
      })
      .finally(() => {
        setLoading(false);
      });
  };

  /**
   * Handles clearing the search bar.
   * Resets table pagination too.
   *
   * @function handleClear
   * */
  const handleClear = () => {
    if (filterText) {
      setResetPaginationToggle(!resetPaginationToggle);
      setFilterText("");
    }
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
              <h1 className="bold mb-0">Data Logs</h1>
              {loading && <Spinner variant="secondary" animation="border" />}
            </Col>
          </Row>
          <Row className="pb-5">
            <Col sm={12}>
              <ManagementBar
                filterText={filterText}
                setFilterText={setFilterText}
                loading={loading}
                handleClear={handleClear}
                onRefresh={fetchDataLog}
              />
            </Col>
          </Row>
          <Row>
            <Col className="data-log-table">
              <CustomDataTable
                columns={columns}
                data={filteredEntries}
                progressPending={loading}
                pagination
                highlightOnHover
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <DataLogDetailModal
        show={showDetails}
        handleClose={handleCloseDetails}
        selectedEntry={selectedEntry}
      />
      <DataLogDownloadModal
        show={showDownload}
        handleClose={handleCloseDownload}
        selectedEntry={selectedEntry}
        download={downloadDataLog}
      />
    </>
  );
}

export default DataLogs;
