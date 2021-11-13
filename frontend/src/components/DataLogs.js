import { React, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Col, Row, Card, Table, Spinner, Button, InputGroup, FormControl, Modal} from "react-bootstrap";
import SearchBar from "./SearchBar";
import DataTable, { createTheme } from "react-data-table-component";
import IconButton from "./IconButton";
import { FaPen, FaRedo, FaPlus, FaTimes, FaCloudDownloadAlt } from "react-icons/fa";
import { Formik } from "formik";
import * as Yup from "yup";

function DataLogs(props){
    const [loading, setLoading] = useState(false);
    const [filterText, setFilterText] = useState("");
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    const [filteredEntries, setFilteredEntries] = useState([]);
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const testData = [
        {
            date: 'February',
            status: 'Complete',

        },
        {
            date: 'March',
            status: 'In Progress',
        }

    ]
    const columns = [
        {
            name: "Details",
            cell: (row) => (
                <Button
                    variant = "link"
                    onClick = {() => {
                        setSelectedEntry(row);
                        handleShow();
                    }}
                >
                    Details
                </Button>
            ),
            button: true,
            allowOverflow: true,
        },
        {name: "Date", selector: (row) => row.date, sortable: true},
        {name: "Status", selector: (row) => row.status, sortable: true},
        {
            name: "",
            cell: (row) => (
                <IconButton
                    icon={<FaCloudDownloadAlt className = "fs-5"/>}
                    //add clickAction download add here
                
                
                />
            ),
            button: true,
            allowiverflow: true,
        },
    ];

    const customStyle = {
        headRow: {
          style: {
            fontSize: "16px",
            backgroundColor: "#f2f3f8",
            borderBottomStyle: "none",
          },
        },
        rows: {
          style: {
            fontSize: "14px",
          },
        },
        pagination: {
          style: {
            backgroundColor: "#f2f3f8",
            borderTopStyle: "none",
          },
        },
      };

      const handleClear = () => {
        if (filterText) {
          setResetPaginationToggle(!resetPaginationToggle);
          setFilterText("");
        }
      };

    
    return(
        <Row className = "h-100">
            <Col className="d-flex-column px-4 pt-4">
                <Row>
                    <Col sm={12} className="pb-4">
                        <h1 className = "bold">Data Logs</h1>
                        {loading && <Spinner variant="secondary" animation="border" />}
                    </Col>
                </Row>
                <Row className = "pb-5">
                    <Col sm={12}>
                        <Card className = "manage-card d-flex align-items-center py-3 flex-row">
                            <div className = "me-auto px-3">
                                <InputGroup>
                                    <FormControl
                                        placeholder = "Search Data Log"
                                        value = {filterText}
                                        onChange={(e) => {
                                            setFilterText(e.target.value);
                                        }}
                                        disabled={loading}
                                    />
                                    <Button
                                        variant="primary"
                                        onClick={handleClear}
                                        disabled={loading}
                                        >
                                        <FaTimes className="fs-5" />
                                    </Button>
                                </InputGroup>
                            </div>
                            <div className="d-flex flex-row align-items-center px-4 gap-4">
                                <IconButton
                                    icon={<FaRedo className="fs-5" />}
                                    clickAction={() => {}} //Finish with refresh of table
                                />
                            </div>
                        </Card >
                    </Col>
                </Row>
                <Row>
                    <Col className="data-log-table">
                    <DataTable
                        columns={columns}
                        data={filteredEntries}
                        theme="rumergy"
                        progressPending={loading}
                        customStyles={customStyle}
                        pagination
                        highlightOnHover
                        data = {testData}
                    />
                    </Col>
                </Row>
            </Col>
        </Row>



    );

}

DataLogs.propTypes = {};

export default DataLogs;