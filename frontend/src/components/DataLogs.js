import { React, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Col, Row, Card, Table } from "react-bootstrap";
import SearchBar from "./SearchBar";

function DataLogs(props){
    const [searchActive, setSearchActive] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [searchInput, setSearchInput] = useState("");

    const logSearch = () => {
        setSearchResults(
            searchInput
                //? => 
                   // return 

        );

    };
   
    
    return(
        <Row className = "h-100">
            <Col className="d-flex-column px-4 pt-4">
                <Row>
                    <Col sm={12} className="pb-4">
                        <h1 className = "bold">Data Logs</h1>
                    </Col>
                </Row>
                <Row className = "flex-grow-1">
                    <Col xs={12} className="d-flex flex-column">
                        <div className = "my-auto">
                            <Card className = "Data-log-card mb-sm-3 flex-row flex-col">
                                <Card.Body>
                                
                                <SearchBar
                                    label={"Search"}
                                    searchFunction={(input) => {
                                        setSearchInput(input);
                                        logSearch();
                                    }}
                                />
                                
                                </Card.Body>
                            </Card >
                            <Card className = "Data-log-card mb-sm-3 flex-row">
                                <Card.Body>
                                    <Table striped bordered hover>
                                        <thead>
                                            <tr>
                                            <th>Date</th>
                                            <th>Details</th>
                                            <th>Status</th>
                                            <th>Download</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                            <td>1</td>
                                            <td>Mark</td>
                                            <td>Otto</td>
                                            <td>@mdo</td>
                                            </tr>
                                            <tr>
                                            <td>2</td>
                                            <td>Jacob</td>
                                            <td>Thornton</td>
                                            <td>@fat</td>
                                            </tr>
                                            <tr>
                                            <td>3</td>
                                            <td colSpan="2">Larry the Bird</td>
                                            <td>@twitter</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </Card.Body>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </Col>
        </Row>



    );

}

DataLogs.propTypes = {};

export default DataLogs;