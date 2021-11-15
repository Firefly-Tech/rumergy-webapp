import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Col, Row, Modal, Button, Card, Spinner, InputGroup, FormControl, Form } from "react-bootstrap";
import SearchBar from "./SearchBar";
import IconButton from "./IconButton";
import { FaRedo, FaPlus, FaPen, FaTimes, FaSync, FaTrash, FaExclamation, FaCheck} from "react-icons/fa";
import DataTable, {createTheme} from "react-data-table-component";
import {Formik} from "formik";
import * as Yup from "yup";
import { useRequireAuth } from "../resources/use-require-auth";
import { roles } from "../resources/constants";
import ManagementBar from "./ManagementBar";
import CustomDataTable from "./CustomDataTable";
import MeterModelAddModal from "./MeterModelAddModal";
import MeterModelEditModal from "./MeterModelEditModal";

const emptyEditMeterModelEntry = {
    id: null,
    name: "",
    datafields:"",
};


function ManageMeterModel(props){
    const [loading, setLoading] = useState(false);
    const [meterModel, setMeterModel] = useState([]);

    const [filterText, setFilterText] = useState("");
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    const [filteredEntries, setFilteredEntries] = useState([]);

    const [selectedEditEntry, setSelectedEditEntry] = useState(emptyEditMeterModelEntry);

    const [showEdit, setShowEdit] = useState(false);
    const handleCloseEdit = () => setShowEdit(false);
    const handleShowEdit = () => setShowEdit(true);

    const [showAdd, setShowAdd] = useState(false);
    const handleCloseAdd = () => setShowAdd(false);
    const handleShowAdd = () => setShowAdd(true);

    const auth = useRequireAuth("/admin/meter-models", [roles.Admin]); // Change

    const testData = [
        {
            id: '1',
            name: 'Ale',
            datafields: 'demand, consumption',

        },
        {
            id: '1',
            name: 'Ale',
            datafields: 'demand, consumption',

        }

    ]

    // useEffect(async () => {
    //     await fetchMeterModels();
    // }, []);

    useEffect(() => {
        setLoading(true);
        setFilteredEntries(
            meterModel.filter((meterModels) =>
                meterModels.meterModelString
                    .toLowerCase()
                    .includes(filterText.split(" ").join("").toLowerCase()) //Check this 
            )
        );
        setLoading(false);
    }, [meterModel, filterText]);


    //Check
    // const fetchMeterModels = async () => { 
    //     setLoading(true);
    //     let data = await auth.userAxiosInstance
    //         .get(`${auth.apiHost}/api/meter-models`)
    //         .then((res) =>{
    //             return res.data;
    //         })
    //         .catch(() => {
    //             return[];
    //         });

    //     if(data.length){
    //         data = data.map((meterModel) =>{
    //             let meterStringElements =[
    //                 meterModel.id,
    //                 meterModel.name,
    //                 meterModel.dataFields
    //             ];

                
    //         });

    //     }
    //     setMeterModels(data);
    //     setLoading(false);
        
    // };

    const columns = [
        {
            name: "Action",
            cell: (row) =>(
                <IconButton
              icon={<FaPen className="fs-5" />}
              clickAction={() => {
                setSelectedEditEntry(row);
                handleShowEdit();
              }}
            />
            ),
            button: true,
            allowOverflow: true,
    
        },
        {name: "ID", selector: (row) => row.id, sortable: true},
        {name: "Name", selector: (row) => row.name, sortable: true},
        {name: "Data Fields", selector: (row) => row.datafields, sortable: true},
    ];

    const handleClear = () => {
         if(filterText){
            setResetPaginationToggle(!resetPaginationToggle);
            setFilterText("");
        }
    
    };

    const handleAdd = async (values, {setSubmitting}) => {
        setLoading(true);
        let data = {
            name: values.name,
            model: values.model,
            datafields: values.datafields,
        };

        return auth.userAxiosInstance
            .post(`${auth.apiHost}/api/meter-models`, data)
            .then(() =>{
                //fetchMeterModels();
                return true;
            })
            .catch(() =>{
                return false;
            })
            .finally(() => {
                setSubmitting(false);
                setLoading(false);
            });
    };

    const handleEdit = async (id, values, {setSubmitting}) => {
        setLoading(true);
        let data = {
            name: values.name,
            model: values.model,
            datafields: values.datafields,
        };

        return auth.userAxiosInstance
            .patch(`${auth.apiHost}/api/meter-models/${id}/`, data)//ask about this
            .then(() =>{
                //fetchMeterModels();
                return true;
            })
            .catch(() =>{
                return false;
            })
            .finally(() => {
                setSubmitting(false);
                setLoading(false);
            });
    };

    const handleDelete = async (id, {setSubmitting}) => {
        setLoading(true);

        return auth.userAxiosInstance
            .delete(`${auth.apiHost}/api/meter-models/${id}/`)
            .then(() =>{
                //fetchMeterModels();
                return true;
            })
            .catch(() =>{
                return false;
            })
            .finally(() => {
                setSubmitting(false);
                setLoading(false);
            });
    };

    return(
        <>
            <Row className = "h-100">
                <Col className="d-flex-column px-4 pt-4">
                    <Row>
                        <Col sm={12} className="d-flex flex-row align-items-center pb-4 gap-4">
                            <h1 className = "bold">Meter Models</h1>
                            {loading && <Spinner variant="secondary" animation="border" />}
                        </Col>
                    </Row>
                    <Row className = "pb-5">
                        <Col sm={12}>
                            <ManagementBar
                                filterText={filterText}
                                setFilterText={setFilterText}
                                loading={loading}
                                addButton
                                addText = {"Add new meter model"}
                                handleClear={handleClear}
                                // onRefresh={fetchMeters}
                                onAdd={handleShowAdd}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col className = "meter-model-table">
                            <CustomDataTable
                                columns = {columns}
                                data = {filteredEntries}
                                progressPending = {loading}
                                pagination
                                highlightOnHover
                                data = {testData}
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>
            <MeterModelEditModal
                show={showEdit}
                handleClose={handleCloseEdit}
                selectedEditEntry={selectedEditEntry}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
            />
            <MeterModelAddModal
                show = {showAdd}
                handleClose = {handleCloseAdd}
                handleSubmit = {handleAdd}
            />

        </>
    );

}

export default ManageMeterModel;