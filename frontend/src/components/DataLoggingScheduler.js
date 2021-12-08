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
import { add, addSeconds, formatISO } from "date-fns";
import * as Yup from "yup";
import DateTimePicker from "react-datetime-picker";
import { buildStatus } from "../resources/helpers";

/**
 * Interval for real time readings
 *
 * @constant REAL_TIME_INTERVAL
 * */
const REAL_TIME_INTERVAL = 3;

/**
 * Tranformation of a day to seconds
 * 
 * @constant ONE_DAY_IN_SEC
 **/
const ONE_DAY_IN_SEC = 24 * 60 * 60;

/**
 * Yup validation schema for data log form.
 *
 * @constant {object} dataLogSubmitSchema
 * */
const dataLogSubmitSchema = Yup.object().shape({
  meter: Yup.number().integer().required("Choosing a Meter is required"),
  timeInterval: Yup.number()
    .typeError("Must provide a number")
    .integer("Must be an integer")
    .min(REAL_TIME_INTERVAL, "Cannot be less than 3 seconds")
    .max(ONE_DAY_IN_SEC, "Must be at most 24 hours")
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
    .of(Yup.number().integer())
    .min(1, "Must select at least one data point")
    .max(50, "Can select up to 50 data points")
    .required("Data point is required"),
});

/**
 *  Wrapper for all formik logic
 * 
 * @function DLSFormikWrapper 
 **/
function DLSFormikWrapper() {
  //States
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [meters, setMeters] = useState([]);

  const auth = useRequireAuth("/login", [roles.Advanced]);

  useEffect(() => {
    /**
     * Fetch meter data on load.
     *
     * @memberof DataLoggingScheduler
     * */
    fetchMeters();
  }, []);


  /**
 *  Fetches Meter data
 * 
 * @function fetchMeters 
 * @async
 **/
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

  /**
 *  Handles data submit
 * 
 * @function handleSubmit 
 **/
  const handleSubmit = (values, { setSubmitting }) => {
    setLoading(true);
    let data = {
      meter: parseInt(values.meter),
      user: auth.user.id,
      start_date: values.startDate.toISOString(),
      end_date: values.endDate.toISOString(),
      sampling_rate: values.timeInterval,
      data_points: values.dataPoints,
    };

    return auth.userAxiosInstance
      .post(`${auth.apiHost}/api/data-logs/`, data)
      .then(() => {
        return buildStatus(true);
      })
      .catch(() => {
        return buildStatus(false, "An error occurred, please try again.");
      })
      .finally(() => {
        setSubmitting(false);
        setLoading(false);
      });
  };

  return (
    <Row className="h-100">
      <Col className="d-flex flex-column px-4 pt-4">
        {/*HEADER*/}
        <Row>
          <Col
            sm={12}
            className="d-flex flex-row align-items-center pb-4 gap-4"
          >
            <h1 className="bold mb-0">Data Logging Scheduler</h1>
            {loading && <Spinner variant="secondary" animation="border" />}
          </Col>
        </Row>
        <Formik
          initialValues={{
            meter: "",
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
            <Form
              onSubmit={formik.handleSubmit}
              noValidate
              className="pt-4"
              as={Row}
            >
              <DataLoggingScheduler
                auth={auth}
                formik={formik}
                success={success}
                error={error}
                errorMessage={errorMessage}
                loading={loading}
                setSuccess={setSuccess}
                setError={setError}
                setErrorMessage={setErrorMessage}
                setLoading={setLoading}
                meters={meters}
              />
            </Form>
          )}
        </Formik>
      </Col>
    </Row>
  );
}

/** Data Logging Scheduler for advanced users. */
function DataLoggingScheduler(props) {
  //Modal State
  const [modalShow, setModalShow] = useState(false);
  const [dataPoints, setDataPoints] = useState([]);
  const [showCustomInterval, setShowCustomInterval] = useState(false);


  useEffect(() => {
    /**
     * Updates data points when a meter is selected
     *
     * @memberof DataLoggingScheduler
     * */
    if (!props.loading && props.meters.length && props.formik.values.meter) {
      fetchDataPoints();
      props.formik.setFieldValue("dataPoints", []);
    } else {
      setDataPoints([]);
      props.formik.setFieldValue("dataPoints", []);
    }
  }, [props.formik.values.meter]);

  /**
 *  Fetches data point data
 * 
 * @function fetchDataPoints 
 * @async
 **/
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
        id: parseInt(dataPoint.id),
        name: dataPoint.name,
        selected: false,
      }))
    );
    props.setLoading(false);
  };

  return (
    <>
    {/* Body */}
      <Col sm={9} className="d-flex flex-column">
        <Card className="DLS-card mb-sm-3 flex-row flex-fill">
          <Card.Title className="d-flex flex-row align-self-center px-3 pt-2">
            <h4 className="bold mb-0">Meter</h4>
          </Card.Title>
          <Card.Body className="building-content">
            <Form.Group>
              <InputGroup hasValidation>
                <Form.Select
                  id="meter"
                  placeholder="Select meter"
                  isInvalid={!!props.formik.errors.meter}
                  disabled={!props.meters.length || props.loading}
                  value={props.formik.values.meter}
                  onChange={(e) => {
                    props.formik.handleChange(e);
                    props.formik.setFieldTouched("meter", true, true);
                  }}
                >
                  <option value="" defaultChecked className="text-muted">
                    Please select a meter
                  </option>
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
            </Form.Group>
          </Card.Body>
        </Card>
        <Card className="mb-sm-3 flex-fill">
          <Card.Title className="d-flex flex-row align-self-start px-3 pt-2">
            <h4 className="bold mb-0">Time Interval</h4>
          </Card.Title>
          <Card.Body className="building-content">
            <Form.Group>
              <Form.Check
                type="radio"
                label="Real Time (3 seconds)"
                name="timeInterval"
                onChange={(e) => {
                  props.formik.setFieldValue(
                    "timeInterval",
                    REAL_TIME_INTERVAL
                  );
                  props.formik.setFieldTouched("timeInterval", true, true);
                  setShowCustomInterval(false);
                }}
              />
              <div className="d-flex flex-row gap-3 align-items-center mt-3 pb-2">
                <Form.Check
                  type="radio"
                  label="Custom"
                  name="timeInterval"
                  onChange={(e) => {
                    props.formik.setFieldTouched("timeInterval", true, true);
                    setShowCustomInterval(true);
                  }}
                />
                <Form.Control
                  placeholder="Enter custom interval in minutes"
                  size="sm"
                  type={"number"}
                  disabled={!showCustomInterval}
                  onChange={(e) => {
                    if (!Number.isInteger(Number(e.target.value))) {
                      props.formik.setFieldError(
                        "timeInterval",
                        "Must be an integer"
                      );
                      return;
                    } else if (Number.isNaN(parseInt(e.target.value))) {
                      props.formik.setFieldError(
                        "timeInterval",
                        "Must provide an interval"
                      );
                      return;
                    }
                    props.formik.setFieldValue(
                      "timeInterval",
                      parseInt(e.target.value) * 60
                    );
                  }}
                />
              </div>
              <span className="text-danger">
                {props.formik.errors.timeInterval}
              </span>
              {!props.formik.touched["timeInterval"] && (
                <span className="text-danger">Must select a time interval</span>
              )}
            </Form.Group>
          </Card.Body>
        </Card>
        <Card className="DLS-card mb-sm-3 flex-fill">
          <Card.Title className="d-flex flex-row align-self-start px-3 pt-2">
            <h4 className="bold mb-0">Start Date</h4>
          </Card.Title>
          <Card.Body>
            <DateTimePicker
              className="date-picking-thing"
              name="startDate"
              onCalendarOpen={() =>
                props.formik.setFieldTouched("startDate", true, true)
              }
              onClockOpen={() => {
                props.formik.setFieldTouched("startDate", true, true);
              }}
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
        <Card className="DLS-card flex-fill">
          <Card.Title className="d-flex flex-row align-self-start px-3 pt-2">
            <h4 className="bold mb-0">End Date</h4>
          </Card.Title>
          <Card.Body>
            <DateTimePicker
              className="date-picking-thing"
              id="endDate"
              name="endDate"
              onCalendarOpen={() =>
                props.formik.setFieldTouched("endDate", true, true)
              }
              onClockOpen={() => {
                props.formik.setFieldTouched("endDate", true, true);
              }}
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
      </Col>
      <Col sm={3} className="d-flex flex-column">
        <Card className="DLS-card mb-sm-3 flex-fill">
          <Card.Title className="d-flex flex-row align-self-start px-3 pt-2">
            <h4 className="bold mb-0">Data Points</h4>
          </Card.Title>
          <Card.Body className="building-content">
            <FieldArray
              name="dataPoints"
              render={({ push, remove }) => (
                <div className="data-points-container d-flex flex-column">
                  {dataPoints.length ? (
                    dataPoints.map((dataPoint, index) => (
                      <label
                        key={index}
                        className="d-flex flex-row gap-1 align-items-center"
                      >
                        <input
                          name="dataPoints"
                          type="checkbox"
                          className="larger"
                          value={dataPoint.id}
                          key={index}
                          checked={props.formik.values.dataPoints.includes(
                            dataPoint.id
                          )}
                          onBlur={() =>
                            props.formik.setFieldTouched(
                              "dataPoints",
                              true,
                              true
                            )
                          }
                          onChange={(e) => {
                            if (e.target.checked) {
                              push(dataPoint.id);
                            } else {
                              const idx =
                                props.formik.values.dataPoints.indexOf(
                                  dataPoints.id
                                );
                              remove(idx);
                            }
                          }}
                        />
                        <span>{`${
                          dataPoint.name.charAt(0).toUpperCase() +
                          dataPoint.name.slice(1)
                        }`}</span>
                      </label>
                    ))
                  ) : (
                    <span className="text-muted">Please select a meter</span>
                  )}
                  <span className="text-danger mt-2">
                    {props.formik.errors.dataPoints}
                  </span>
                </div>
              )}
            />
          </Card.Body>
        </Card>
        <Button variant="primary" onClick={() => setModalShow(true)}>
          Submit
        </Button>
      </Col>
      <DLSsubmitModal
        show={modalShow}
        onHide={() => {
          setModalShow(false);
          props.setError(false);
          props.setSuccess(false);
          props.setErrorMessage("");
        }}
        submit={props.formik.submitForm}
        success={props.success}
        error={props.error}
        errorMessage={props.errorMessage}
      />
    </>
  );
}

DataLoggingScheduler.propTypes = {
  auth: PropTypes.object,
  formik: PropTypes.object,
  success: PropTypes.bool,
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  loading: PropTypes.bool,
  setSuccess: PropTypes.func,
  setError: PropTypes.func,
  setErrorMessage: PropTypes.func,
  setLoading: PropTypes.func,
  meters: PropTypes.array,
};

export default DLSFormikWrapper;
