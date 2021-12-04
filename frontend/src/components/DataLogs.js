import { React, useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Col,
  Row,
  Card,
  Table,
  Spinner,
  Button,
  InputGroup,
  FormControl,
  Modal,
} from "react-bootstrap";
import SearchBar from "./SearchBar";
import DataTable, { createTheme } from "react-data-table-component";
import IconButton from "./IconButton";
import {
  FaPen,
  FaRedo,
  FaPlus,
  FaTimes,
  FaCloudDownloadAlt,
} from "react-icons/fa";
import { Formik } from "formik";
import * as Yup from "yup";
import ManagementBar from "./ManagementBar";
import CustomDataTable from "./CustomDataTable";
import DataLogDetailModal from "./DataLogDetailModal";
import DataLogDownloadModal from "./DataLogDownloadModal";
import { useRequireAuth } from "../resources/use-require-auth";
import { roles } from "../resources/constants";

function DataLogs(props) {
  const [loading, setLoading] = useState(false);
  const [dataLog, setdataLog] = useState([]);

  // Filter state
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [filteredEntries, setFilteredEntries] = useState([]);

  const [selectedEntry, setSelectedEntry] = useState({});

  // Detail States
  const [showDetails, setShowDetails] = useState(false);
  const handleCloseDetails = () => setShowDetails(false);
  const handleShowDetails = () => setShowDetails(true);

  //Download State
  const [showDownload, setShowDownload] = useState(false);
  const handleCloseDownload = () => setShowDownload(false);
  const handleShowDownload = () => setShowDownload(true);

  const auth = useRequireAuth("/advanced/data-logs", [roles.Advanced]);

  //Test Data
  const testData = [
    {
      date: "February",
      status: "Complete",
    },
  ];

  useEffect(() => {
    fetchDataLog();
  }, []);

  useEffect(() => {
    setLoading(true);
    setFilteredEntries(
      dataLog.filter(
        (data_logs) =>
          data_logs.meterString
            .toLowerCase()
            .includes(filterText.split(" ").join("").toLowerCase()) //Check this
      )
    );
    setLoading(false);
  }, [dataLog, filterText]);

  const fetchDataLog = async () => {
    setLoading(true);
    let data = await auth.userAxiosInstance
      .get(`${auth.apiHost}/api/data-logs`)
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        return [];
      });
    

    if (data.length) {
      data = data.map((data_logs) => {
        let dataLogStringElements = [
          data_logs.id,
          data_logs.name,
          data_logs.ip,
          data_logs.port,
          data_logs.building,
        ];
        return { userString: dataLogStringElements.join(""), ...dataLog };
      });
    }
    setdataLog(data);
    setLoading(false);
  };

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
    { name: "Date", selector: (row) => row.date, sortable: true },
    { name: "Status", selector: (row) => row.status, sortable: true },
    {
      name: "",
      cell: (row) => (
        <IconButton
          icon={<FaCloudDownloadAlt className="fs-5" />}
          clickAction={() => {
            setSelectedEntry(row);
            handleShowDownload();
            //TODO add backend download//
          }}
        />
      ),
      button: true,
      allowiverflow: true,
    },
  ];

  const handleClear = () => {
    if (filterText) {
      setResetPaginationToggle(!resetPaginationToggle);
      setFilterText("");
    }
  };

  return (
    <>
      <Row className="h-100">
        <Col className="d-flex-column px-4 pt-4">
          <Row>
            <Col sm={12} className="pb-4">
              <h1 className="bold">Data Logs</h1>
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
                data={testData}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <DataLogDetailModal 
      show={showDetails} 
      handleClose={handleCloseDetails} 
      selectedEntry ={selectedEntry}
      />
      <DataLogDownloadModal
        show={showDownload}
        handleClose={handleCloseDownload}
        selectedEntry={selectedEntry}
      />
    </>
  );
}

DataLogs.propTypes = {};

export default DataLogs;
