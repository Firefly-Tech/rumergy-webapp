import { React, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Col, Row, Modal, Button, Card, Spinner, InputGroup, FormControl, Form } from "react-bootstrap";
import SearchBar from "./SearchBar";
import IconButton from "./IconButton";
import { FaRedo, FaPlus, FaPen, FaTimes } from "react-icons/fa";
import DataTable, {createTheme} from "react-data-table-component";
import {Formik} from "formik";
import * as Yup from "yup";
//import { useRequireAuth } from "../resources/use-require-auth";
//import { roles } from "../resources/constants";
function ManageMeter(props){
    const [loading, setLoading] = useState(false);
    const [meters, setMeters] = useState([]);
    const [filterText, setFilterText] = useState("");
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    const [filteredEntries, setFilteredEntries] = useState([]);

    const [selectedEntry, setSelectedEntry] = useState(null);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    //const auth = useRequireAuth("/login", [roles.Admin]);

    const testData = [
        {
            name: 'Ale',
            model: 'E Mon',
            ip: '8415',
            port: '7777',
            building: 'Stefani',

        }

    ]
    const columns = [
    {
        name: "Action",
        cell: (row) =>(
            <IconButton
          icon={<FaPen className="fs-5" />}
          clickAction={() => {
            setSelectedEntry(row);
            handleShow();
          }}
        />
        ),
        button: true,
        allowOverflow: true,

    },
    {name: "Name", selector: (row) => row.name, sortable: true},
    {name: "Model", selector: (row) => row.model, sortable: true},
    {name: "IP", selector: (row) => row.ip, sortable:true},
    {name: "Port", selector: (row) => row.port, sortable: true},
    {name: "Building", selector: (row) => row.building, sortable: true},
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
        if(filterText){
            setResetPaginationToggle(!resetPaginationToggle);
            setFilterText("");
        }

    };
    

    return(
        <>
            <Row className = "h-100">
                <Col className="d-flex-column px-4 pt-4">
                    <Row>
                        <Col sm={12} className="d-flex flex-row align-items-center pb-4 gap-4">
                            <h1 className = "bold">Meters</h1>
                            {loading && <Spinner variant="secondary" animation="border" />}
                        </Col>
                    </Row>
                    <Row className = "pb-5">
                        <Col sm={12}>
                            <Card className = "manage-card d-flex flex-row align-items-center py-3">
                                <div className = "me-auto px-3">
                                    <InputGroup>
                                        <FormControl
                                            placeholder = "Filter entries"
                                            value = {filterText}
                                            onChange = {(e) => {
                                                setFilterText(e.target.value);
                                            }}
                                            disabled = {loading}
                                        />
                                        <Button
                                            variant = "primary"
                                            onClick = {handleClear}
                                            disabled = {loading}
                                        >
                                                <FaTimes className = "fs-5"/>
                                        </Button>
                                    </InputGroup>
                                </div>
                                <div className = "d-flex flex-row align-items-center px-4 gap-4">
                                    <IconButton
                                        icon ={<FaRedo className = "fs-5"/>}
                                        clickAction = {() => {}}
                                    />
                                    <Button
                                        variant = "primary"
                                        className = "d-flex flex-row align-items-center gap-3"
                                        onClick = {() => {
                                            setSelectedEntry(null);
                                            handleShow();
                                        }}
                                    >
                                        <FaPlus className = "fs=5"/>
                                        <span className = "d-none d-sm-inline">
                                            {"Add new meter"}
                                        </span>
                                    </Button>
                                </div>
                            </Card >
                        </Col>
                    </Row>
                    <Row>
                        <Col className = "meter-table">
                            <DataTable
                                columns = {columns}
                                data = {filteredEntries}
                                theme = "rumergy"
                                progressPending = {loading}
                                customStyles ={customStyle}
                                pagination
                                highlightOnHover
                                data = {testData}
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>

        </>

    );
}
ManageMeter.propTypes = {};

export default ManageMeter;