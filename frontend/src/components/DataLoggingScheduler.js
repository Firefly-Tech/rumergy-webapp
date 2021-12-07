import { React, useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Col,
  Row,
  Button,
  Form,
  Card,
  InputGroup,
  Spinner,
} from "react-bootstrap";
import DLSsubmitModal from "./DLSsubmitModal";
import { useRequireAuth } from "../resources/use-require-auth";
import { roles } from "../resources/constants";
import { Formik, FieldArray } from "formik";
import { add, addSeconds } from "date-fns";
import * as Yup from "yup";
import DateTimePicker from "react-datetime-picker";

/**
 *
 *
 * @constant REAL_TIME_INTERVAL
 * */
const REAL_TIME_INTERVAL = 3;

const dataLogSubmitSchema = Yup.object().shape({
  meter: Yup.number().integer().required("Choosing a Meter is required"),
  timeInterval: Yup.number()
    .integer("Must be an integer")
    .required("Choosing a Time Interval is required"),
  startDate: Yup.date()
    .typeError("Must provide a date")
    .min(new Date(Date.now()), "Date cannot be in the past")
    .max(
      add(new Date(Date.now()), { days: 30 }),
      "Start date can be at most a week from now"
    )
    .required("Choosing a Start Date is required"),
  endDate: Yup.date().when("timeInterval", {
    is: REAL_TIME_INTERVAL,
    then: Yup.date()
      .typeError("Must provide a date")
      .when(
        ["startDate", "timeInterval"],
        (startDate, timeInterval, schema) => {
          if (!startDate) return;
          let min = addSeconds(startDate, timeInterval);
          let max = add(startDate, { minutes: 5 });

          return schema
            .min(
              min,
              "End date must be after start date and must allow for at least one interval"
            )
            .max(max, "For real time, max schedule length is 5 minutes");
        }
      )
      .required("End date is required"),
    otherwise: Yup.date()
      .typeError("Must provide a date")
      .when(
        ["startDate", "timeInterval"],
        (startDate, timeInterval, schema) => {
          if (!startDate) return;
          let min = addSeconds(startDate, timeInterval);
          let max = add(startDate, { days: 30 });

          return schema
            .min(
              min,
              "End date must be after start date and must allow for at least one interval"
            )
            .max(max, "Schedules cannot be more than 30 days long");
        }
      )
      .required("End date is required"),
  }),
  dataPoints: Yup.array()
    .of(Yup.number().integer().min(1))
    .max(50)
    .required("Must select at least one data point"),
});

function DLSFormikWrapper() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [meters, setMeters] = useState([]);

  const auth = useRequireAuth("/login", [roles.Advanced]);

  useEffect(() => {
    fetchMeters();
  }, []);

  const fetchMeters = async () => {
    setLoading(true);
    let data = await auth.userAxiosInstance
      .get(`${auth.apiHost}/api/meters`, {
        params: { ordering: "building__name" },
      })
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        return [];
      });

    if (data.length) {
      data = await Promise.all(
        data.map(async (meter) => {
          let building = await auth.userAxiosInstance
            .get(`${auth.apiHost}/api/buildings/${meter.building}`)
            .then((res) => {
              return res.data;
            });

          return {
            id: meter.id,
            name: `${meter.name} (${building.name})`,
            meterModel: meter.meter_model,
          };
        })
      );
    }

    setMeters(data);
    setLoading(false);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    console.log("Submit");
  };

  return (
    <Formik
      initialValues={{
        meter: meters.length ? meters[0].id : 1,
        timeInterval: REAL_TIME_INTERVAL,
        startDate: new Date(Date.now()),
        endDate: new Date(Date.now()),
        dataPoints: [],
      }}
      validationSchema={dataLogSubmitSchema}
      onSubmit={async (values, handlers) => {
        let status = await handleSubmit(values, handlers);
        if (status.success) setSuccess(true);
        else {
          setError(true);
          setErrorMessage(status.errorMessage);
        }
      }}
    >
      {(formik) => (
        <DataLoggingScheduler
          auth={auth}
          formik={formik}
          success={success}
          error={error}
          loading={loading}
          setSuccess={setSuccess}
          setError={setError}
          setLoading={setLoading}
          meters={meters}
        />
      )}
    </Formik>
  );
}

function DataLoggingScheduler(props) {
  //Modal State
  const [modalShow, setModalShow] = useState(false);
  const [dataPoints, setDataPoints] = useState([]);

  useEffect(() => {
    if (!props.loading && props.meters.length) {
      fetchDataPoints();
    }
  }, [props.formik.values.meter]);

  const fetchDataPoints = async () => {
    props.setLoading(true);
    let meterModel = props.meters.filter(
      (meter) => meter.id === parseInt(props.formik.values.meter)
    )[0].meterModel;

    let data = await props.auth.userAxiosInstance
      .get(`${props.auth.apiHost}/api/data-points`, {
        params: { model: meterModel },
      })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        return [];
      });
    setDataPoints(
      data.map((dataPoint) => ({
        id: dataPoint.id,
        name: dataPoint.name,
        selected: false,
      }))
    );
    props.setLoading(false);
  };

  return (
    <Row className="h-100">
      <Col className="d-flex-column px-4 pt-4">
        {/*HEADER*/}
        <Row>
          <Col
            sm={12}
            className="d-flex flex-row align-items-center pb-4 gap-4"
          >
            <h1 className="bold mb-0">Data Logging Scheduler</h1>
            {props.loading && (
              <Spinner variant="secondary" animation="border" />
            )}
          </Col>
        </Row>
        {/* BODY */}
        <Form
          onSubmit={props.formik.handleSubmit}
          noValidate
          className="d-flex flex column"
        >
          <Row className="flex-grow-1 ">
            <Col xs={10} className=" d-flex flex-column">
              <div className="my-auto">
                {/* <DLSMeterSelect /> */}
                <Card className="DLS-card mb-sm-3 flex-row">
                  <Card.Title className="d-flex flex-row align-self-center px-3 pt-2">
                    <h4 className="bold mb-0">Meter</h4>
                  </Card.Title>
                  <Card.Body className="building-content">
                    <InputGroup hasValidation>
                      <Form.Select
                        id="meter"
                        placeholder="Select meter"
                        isInvalid={!!props.formik.errors.meter}
                        {...props.formik.getFieldProps("meter")}
                        disabled={!props.meters.length || props.loading}
                      >
                        {props.meters.map((meter, index) => (
                          <option value={meter.id} key={index}>
                            {meter.name}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {props.formik.errors.meter}
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
                      id="timeInterval"
                      isInvalid={!!props.formik.errors.timeInterval}
                      {...props.formik.getFieldProps("timeInterval")}
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
                <Card className="DLS-card mb-sm-3 flex-fill">
                  <Card.Title className="d-flex flex-row align-self-start px-3 pt-2">
                    <h4 className="bold mb-0">Date Start</h4>
                  </Card.Title>
                  <Card.Body>
                    <DateTimePicker
                      className="date-picking-thing"
                      name="startDate"
                      onChange={(val) => {
                        props.formik.setFieldValue("startDate", val);
                      }}
                      value={props.formik.values.startDate}
                      minDate={new Date(Date.now())}
                    />
                    <span className="text-danger px-3">
                      {props.formik.errors.startDate}
                    </span>
                  </Card.Body>
                </Card>
                {/* <DLSDateEnd /> */}
                <Card className="DLS-card mb-sm-3 flex-fill">
                  <Card.Title className="d-flex flex-row align-self-start px-3 pt-2">
                    <h4 className="bold mb-0">Date End</h4>
                  </Card.Title>
                  <Card.Body>
                    <DateTimePicker
                      className="date-picking-thing"
                      name="endDate"
                      onChange={(val) => {
                        props.formik.setFieldValue("endDate", val);
                      }}
                      value={props.formik.values.endDate}
                      minDate={props.formik.values.startDate}
                    />
                    <span className="text-danger px-3">
                      {props.formik.errors.endDate}
                    </span>
                  </Card.Body>
                </Card>
              </div>
            </Col>
            <Col
              sm={"auto"}
              className="d-flex flex-column justify-content-evenly"
            >
              {/* <DLSDataPoints /> */}
              <Card className="DLS-card mb-sm-3 flex-fill">
                <Card.Title className="d-flex flex-row align-self-start px-3 pt-2">
                  <h4 className="bold mb-0">Data Points</h4>
                </Card.Title>
                <Card.Body className="building-content">
                  {console.log(dataPoints)}
                  <FieldArray
                    name="dataPoints"
                    render={({ insert, remove, push }) => (
                      <Form.Group>
                        {dataPoints.map((dataPoint, index) => (
                          <Form.Check
                            key={index}
                            label={dataPoint.name}
                            checked={dataPoints[index].selected}
                            onChange={() => {
                              dataPoints[index].selected =
                                !dataPoints[index].selected;

                              // TODO: Create component to store datapoint index, checked status, etc.
                              if (dataPoints[index].selected) push();
                            }}
                          />
                        ))}
                      </Form.Group>
                    )}
                  />
                </Card.Body>
              </Card>

              <>
                <Button variant="primary" onClick={() => setModalShow(true)}>
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
      </Col>
    </Row>
  );
}

DataLoggingScheduler.propTypes = {
  auth: PropTypes.object,
  formik: PropTypes.object,
  success: PropTypes.bool,
  error: PropTypes.bool,
  loading: PropTypes.bool,
  setSuccess: PropTypes.func,
  setError: PropTypes.func,
  setLoading: PropTypes.bool,
  meters: PropTypes.array,
};

export default DLSFormikWrapper;
