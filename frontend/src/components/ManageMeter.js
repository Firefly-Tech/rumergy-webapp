import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Col, Row, Modal, Button, Card, Spinner, InputGroup, FormControl, Form } from "react-bootstrap";
import SearchBar from "./SearchBar";
import IconButton from "./IconButton";
import { FaRedo, FaPlus, FaPen, FaTimes, FaSync, FaTrash, FaExclamation, FaCheck} from "react-icons/fa";
import DataTable, {createTheme} from "react-data-table-component";
import {Formik} from "formik";
import * as Yup from "yup";
//import { useRequireAuth } from "../resources/use-require-auth";
//import { roles } from "../resources/constants";
import MMBar from "./MMBar";

// const meterEditFormSchema = Yup.object.shape({
//     name: Yup.string()
//         .min(1, "Must be at least 1 character")
//         .max(50, "Must be at most 50 characters")
//         .required("Name is required")
//         .matches(/\b([A-ZÀ-ÿ][-,a-z. ']+[ ]*)+/, "Invalid format"),
//     model: Yup.string()
//         .min(1, "Must be at least 1 character")
//         .max(50, "Must be at most 50 characters")
//         .required("Model name is required")
//         .matches(/\b([A-ZÀ-ÿ][-,a-z. ']+[ ]*)+/, "Invalid format"),
//     ip: Yup.number()

//     port: Yup.number()

//     building: Yup.string()
//         .min(1, "Must be at least 1 character")
//         .max(50, "Must be at most 50 characters")
//         .required("Building name is required")
//         .matches(/\b([A-ZÀ-ÿ][-,a-z. ']+[ ]*)+/, "Invalid format"),

// });

const emptyEditMeterEntry = {
    name: "",
    model: "",
    ip: "",
    port: "",
    building: "",
};

function ManageMeter(props){
    const [loading, setLoading] = useState(false);
    const [meters, setMeters] = useState([]);
    const [filterText, setFilterText] = useState("");
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    const [filteredEntries, setFilteredEntries] = useState([]);

    const [selectedEditEntry, setSelectedEditEntry] = useState(emptyEditMeterEntry);
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

    // useEffect(async () => {
    //     await fetchMeters();
    // }, []);

    useEffect(() => {
        setLoading(true);
        setFilteredEntries(
            meters.filter((meter) =>
                meter.meterString.toLowerCase().includes(filterText.toLowerCase()) //Check this 
            )
        );
        setLoading(false);
    }, [meters, filterText]);

    //ADDING THING FOR BACKEND
    // const fetchMeters = async () => { 
    //     setLoading(true);
    // };

    const columns = [
    {
        name: "Action",
        cell: (row) =>(
            <IconButton
          icon={<FaPen className="fs-5" />}
          clickAction={() => {
            setSelectedEditEntry(row);
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
                            <MMBar
                                filterText={filterText}
                                setFilterText={setFilterText}
                                loading={loading}
                                handleClear={handleClear}
                                // onRefresh={fetchUsers}
                                // onAdd={handleShowAdd}
                            />
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