import { React, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Col, Row, Modal, Button, Card, Spinner, InputGroup, FormControl } from "react-bootstrap";
import SearchBar from "./SearchBar";
import IconButton from "./IconButton";
import { FaRedo, FaPlus } from "react-icons/fa";
import DataTable, {createTheme} from "react-data-table-component";
import {Formik} from "formik";
import * as Yup from "yup";
function ManageMeter(props){
    const [loading, setLoading] = useState(false);
    const [meters, setMeters] = useState([]);

    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    const [filteredEntries, setFilteredEntries] = useState([]);

    const [selectedEntry, setSelectedEntry] = useState(null);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    //const auth = useRequireAuth("/login", [roles.Admin]);

    // const meterSearch = () => {
    //     setSearchResults(
    //         searchInput
    //             //? => 
    //                // return 

    //     );

    // };

    return(

        <Row className = "h-100">
            <Col className="d-flex-column px-4 pt-4">
                <Row>
                    <Col sm={12} className="pb-4">
                        <h1 className = "bold">Manage Meters</h1>
                    </Col>
                </Row>
                <Row className = "flex-grow-1">
                    <Col xs={12} className="d-flex flex-column">
                        <div className = "my-auto">
                            <Card className = "MM-card mb-sm-3 flex-row flex-col">
                                <Card.Body>
                                
                                {/* <SearchBar
                                    
                                    label={"Search"}
                                    searchFunction={(input) => {
                                        setSearchInput(input);
                                        meterSearch();
                                    }}
                                /> */}
                                <div className = "MM-item-button">
                                    <IconButton
                                        icon = {(<FaRedo/>)}
                                        //clickAction ={() => props.}
                                    />
                                </div>

                                <Button 
                                    // disabled = {true}
                                    variant="primary" 
                                    // onClick={() => setModalShow(true)}
                                    >
                                    Add
                                </Button>

                                
                                </Card.Body>
                            </Card >
                        </div>
                    </Col>
                </Row>
            </Col>
        </Row>


    );
}
ManageMeter.propTypes = {};

export default ManageMeter;