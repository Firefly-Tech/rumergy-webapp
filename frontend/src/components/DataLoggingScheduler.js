import { React, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Col, Row, Modal, Button, Form, Card, InputGroup, } from "react-bootstrap";
import DLSBuildingSelect from "./DLSBuidingSelect";
import DLSMeterSelect from "./DLSMeterSelect";
import DLSDataPoints from "./DLSDataPoints";
import DLSTimeInterval from "./DLSTimeInterval";
import DLSDateStart from "./DLSDateStart";
import DLSDateEnd from "./DLSDateEnd";
import DLSsubmitModal from "./DLSsubmitModal";
import { FaCheck } from "react-icons/fa";
import { useRequireAuth } from "../resources/use-require-auth";
import { roles } from "../resources/constants";
import { Formik } from "formik";
import * as Yup from "yup";
import DateTimePicker from 'react-datetime-picker';


const dataLogSubmitSchema = Yup.object().shape({

  building: Yup.number().integer().required("Choosing a Building is required"),

  meter: Yup.number().integer().required("Choosing a Meter is required"),

  timeInterval: 
    Yup.number().integer()
    .required("Choosing a Time Interval is required"),

  startDate:
    Yup.string()
    .required("Choosing a Start Date is required"),

  endDate:
    Yup.string()
    .required("Choosing a End Date is required"),


  dataPoints: 
    Yup.number().integer()
    .required("Choosing atleast one Data Point is required"),
});


function DataLoggingScheduler(props) {
  const auth = useRequireAuth("/advanced/data-logging-scheduler", [
    roles.Advanced,
  ]);

  //Modal State
  const [modalShow, setModalShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [buildings, setBuildings] = useState([]);

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [value, onChange] = useState(new Date());
  const [value2, onChange2] = useState(new Date());

  // useEffect(() => {
  //   fetchAllData();
  // }, []);

  // const fetchAllData = () => {
  //   setLoading(true);
  //   // fetchMeters();
  //   fetchBuildings();
  //   setLoading(false);
  // };

  // const fetchBuildings = async () => {
  //   let data = await auth.userAxiosInstance
  //     .get(`${auth.apiHost}/api/buildings`)
  //     .then((res) => {
  //       return res.data;
  //     });
  //   setBuildings(
  //     data.map((building) => ({ name: building.name, id: building.id }))
  //   );
  // };

  // const fetchMeters = async () => {
  //   setLoading(true);
  //   let data = await auth.userAxiosInstance
  //     .get(`${auth.apiHost}/api/meters`)
  //     .then((res) => {
  //       return res.data;
  //     })
  //     .catch(() => {
  //       return [];
  //     });
  //   if (data.length){
  //     data = await Promise.all(
  //       data.map(async (meter)=>{
  //         // let building = await auth.userAxiosInstance
  //         //   .get(`${auth.apiHost}/api/buildings/${meter.building}`)
  //         //   .then((res) => {
  //         //     return res.data;
  //         //   });

  //         let dataPointNames = await Promise.all(
  //           meter.data_points.map(async (dPointId) => {
  //             return await auth.userAxiosInstance
  //               .get(`${auth.apiHost}/api/data-points/${dPointId}`)
  //               .then((res) => {
  //                 return res.data.name;
  //               });
  //           })
  //         );
          
  //         //Not necessary? because no search
  //         let meterStringElements = [
  //           meter.name,
  //           //building.name,
  //           dataPointNames.join("").split(" ").join(""),
  //         ];

  //         return{
  //           //building: {id: building.id, name: building.name},
  //           name: meter.name,
  //           dataPointNames: dataPointNames,
  //         };
  //       })
  //     );
  //   }
  //   //set?
  //   setLoading(false);
  // };

  // const Submit = async (values, {setSubmitting}) => {
  //   setLoading(true);

  //   const checkEmpty = (value) => {
  //     return !!value ? value : "None";
  //   };

  //   let data = {
  //     building: values.building,
  //     meter: values.meter,
  //     sampling_rate: values.sampling_rate,
  //     start_date: values.start_date,
  //     end_date: values.end_date,
  //     data_points: values.data_points,
  //   };
    
  //   return auth.userAxiosInstance
  //     .post(`${auth.apiHost}/api/data-logs`, data)
  //     .then(() => {
  //       fetchBuildings();
  //       fetchMeters();

  //     })
      
  // }

  return (
    <Row className="h-100">
      <Col className="d-flex-column px-4 pt-4">
        {/*HEADER*/}
        <Row>
          <Col sm={12} className="pb-4">
            <h1 className="bold">Data Logging Scheduler</h1>
          </Col>
        </Row>
        {/* BODY */}
        <Formik
          initialValues = {{
            building: "",
            meter: "",
            timeInterval: "",
            startDate: "",
            endDate: "",
            dataPoints: "",
          }}
          validationSchema = {dataLogSubmitSchema}
          onSubmit = {async (values, handlers) => {
            let status = await props.handleSubmit(values, handlers);
            if (status.success) setSuccess(true);
            else {
              setError(true);
              setErrorMessage(status.errorMessage);
            }
          }}
        >
          {(formik) => (
            <>
              <Form
                onSubmit = {formik.handleSubmit}
                noValidate
                className = "d-flex flex column"
              >
                <Row className="flex-grow-1 ">
                  <Col xs={10} className=" d-flex flex-column">
                    <div className="my-auto">
                      {/* <DLSBuildingSelect */}
                      <Card className="DLS-card mb-sm-3 flex-row flex-fill">
                        <Card.Title className="d-flex flex-row align-self-center px-3 pt-2">
                          <h4 className="bold mb-0">Building</h4>
                        </Card.Title>
                        <Card.Body className="building-content">
                          <InputGroup hasValidation>
                            <Form.Select 
                            //aria-label="Default select"
                            id="building"
                            placeholder="Enter building"
                            isInvalid={!!formik.errors.building}
                            {...formik.getFieldProps("building")}
                            >
                              {/* <option>Choose Building</option>
                              <option value="1">Chardon</option>
                              <option value="2">Biology</option>
                              <option value="3">Stefani</option> */}
                              {buildings.map((building, index) => (
                                <option value={building.id} key={index}>
                                  {building.name}
                                </option>
                              ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                              {formik.errors.building}
                            </Form.Control.Feedback>
                          </InputGroup>
                        </Card.Body>
                      </Card>
                      {/* <DLSMeterSelect /> */}
                      <Card className="DLS-card mb-sm-3 flex-row">
                        <Card.Title className="d-flex flex-row align-self-center px-3 pt-2">
                          <h4 className="bold mb-0">Meter</h4>
                        </Card.Title>
                        <Card.Body className="building-content">
                          <InputGroup hasValidation>
                            <Form.Select
                              id="meter"
                              aria-label="Default select"
                              isInvalid={!!formik.errors.meter}
                              {...formik.getFieldProps("meter")}
                              disabled={false}
                            >
                              {/* <option>Choose Meter</option>
                              <option value="1">Model 1</option>
                              <option value="2">Model 2</option>
                              <option value="3">Model 3</option> */}
                              {/* {.map((meter, index) => (
                                <option value={meter.id} key={index}>
                                  {meter.name}
                                </option>
                              ))} */}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                              {formik.errors.meter}
                            </Form.Control.Feedback>
                          </InputGroup>
                        </Card.Body>
                      </Card>

                      {/* <DLSTimeInterval /> */}
                      <Card className="DLS-card mb-sm-3 flex-fill">
                        <Card.Title className="d-flex flex-row align-self-start px-3 pt-2">
                          <h4 className="bold mb-0">Time Interval</h4>
                        </Card.Title>
                        <Card.Body className="building-content">
                          <Form.Group
                          id = "timeInterval"
                          isInvalid={!!formik.errors.timeInterval}
                          {...formik.getFieldProps("timeInterval")}
                          >
                              <Form.Check
                                type="radio"
                                label="Real Time"
                                name="formHorizontalRadios"
                                id="formHorizontalRadios1"
                              />
                              <Form.Check
                                type="radio"
                                label="Custom"
                                name="formHorizontalRadios"
                                id="formHorizontalRadios2"
                                //onClick={() => chooseInterval()}
                              />
                              <Form.Control
                                //style = "width: 30px"
                                className="d-flex "
                                size="sm"
                                type={"number"}
                              />
                          </Form.Group>
                        </Card.Body>
                      </Card>

                      {/* <DLSDateStart /> */}
                      <Card className = "DLS-card mb-sm-3 flex-fill">
                          <Card.Title className = "d-flex flex-row align-self-start px-3 pt-2">
                              <h4 className = "bold mb-0">Date Start</h4>
                          </Card.Title>
                          <Card.Body>
                              <DateTimePicker
                              className = ""
                              onChange={onChange}
                              value={value}
                              />
                          </Card.Body>
                      </Card>

                      {/* <DLSDateEnd /> */}
                      <Card className = "DLS-card mb-sm-3 flex-fill">
                          <Card.Title className = "d-flex flex-row align-self-start px-3 pt-2">
                              <h4 className = "bold mb-0">Date End</h4>
                          </Card.Title>
                          <Card.Body>
                              <DateTimePicker
                              onChange={onChange2}
                              value={value2}
                              />
                          </Card.Body>

                      </Card>

                    </div>
                  </Col>
                  <Col
                    sm={"auto"}
                    className="d-flex flex-column justify-content-evenly"
                  >
                    {/* <DLSDataPoints /> */}
                    <Card className = "DLS-card mb-sm-3 flex-fill">
                        <Card.Title className = "d-flex flex-row align-self-start px-3 pt-2">
                            <h4 className = "bold mb-0">Data Points</h4>
                        </Card.Title>
                        <Card.Body className = "building-content"> 
                            <Form.Group 
                              className="px-3" 
                              id="formGridCheckbox"
                              isInvalid={!!formik.errors.dataPoints}
                              {...formik.getFieldProps("dataPoints")}
                              >
                                <Form.Check type="checkbox" label="Consumption" />
                                <Form.Check type="checkbox" label="Demand" />
                            </Form.Group>
                        </Card.Body>
                    </Card>

                    <>
                      <Button
                        variant="primary"
                        onClick={() => setModalShow(true)}
                      >
                        Submit
                      </Button>

                      <DLSsubmitModal
                        show={modalShow}
                        onHide={() => setModalShow(false)}
                      />
                    </>
                  </Col>
                </Row>
              </Form>
            </>
          )}
        </Formik>
      </Col>
    </Row>
  );
}

DataLoggingScheduler.propTypes = {
  handleSubmit: PropTypes.func,
  buildings: PropTypes.array,
  
};

export default DataLoggingScheduler;
