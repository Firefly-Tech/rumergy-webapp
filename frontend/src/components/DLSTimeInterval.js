import { React, useState } from "react";
import PropTypes from "prop-types";
import { Row, Col, Card, Form } from "react-bootstrap";

function DLSTimeInterval(props){
    const [customInterval, setCustomInterval] = useState(false);

    const chooseInterval = () =>{
        


    }

    return(
        <Card className = "DLS-card mb-sm-3 flex-fill">
            <Card.Title className = "d-flex flex-row align-self-start px-3 pt-2">
                <h4 className = "bold mb-0">Time Interval</h4>
            </Card.Title>
            <Card.Body className = "building-content">
                <Form>
                    <fieldset>
                        <div key={`default-radio`} className="mb-3">
                            <Form.Check 
                            type={'radio'}
                            name = "test1"
                            id={`Test1-radio`}
                            label={`Real Time`}
                            />

                            <Form.Check 
                            type={'radio'}
                            name = "test2"
                            id={`Test2-radio`}
                            label={`Custom`}
                            onClick = {() => chooseInterval()}
                            />
                            
                                <Form.Control
                                //style = "width: 30px"
                                className = "d-flex "
                                size = "sm"
                                type = {'number'}
                                />
                        </div>
                        </fieldset>
                </Form>
            </Card.Body> 
        </Card>



    );

}

export default DLSTimeInterval;