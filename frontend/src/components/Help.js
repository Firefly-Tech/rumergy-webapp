import React, { useState } from "react";
import PropTypes from "prop-types";
import { Modal, Row, Col } from "react-bootstrap";
import { FaQuestionCircle } from "react-icons/fa";
import IconButton from "./IconButton";
import ReactPlayer from "react-player/youtube";
import { useRouteMatch } from "react-router-dom";

/**
 * TODO: Finish adding real data
 * Help data to be displayed.
 * Keys must be the url to be matched.
 *
 * @constant {object}
 * */
const helpData = {
  "manage-meters": {
    title: "Manage Meters",
    description: NewlineText(
      "In this page, you can add, edit or remove meters. You can also use the search function to facilitate finding the meter you're looking for.\nRefer to the video below for details on the execution of such:"
    ),
    url: "https://www.youtube.com/watch?v=4ulg0abR0RY",
  },
  "manage-users": {
    title: "Manage Users",
    description: NewlineText(
      "In this page, you can add, edit or remove users. You can also use the search function to facilitate finding the users you're looking for.\nRefer to the video below for details on the execution of such:"
    ),
    url: "https://www.youtube.com/watch?v=4ulg0abR0RY",
  },
  "manage-access-requests": {
    title: "Manage Access Requests",
    description: NewlineText(
      "In this page, you can view, accept or deny access requests. You can also use the search function to facilitate finding the access request you're looking for.\nRefer to the video below for details on the execution of such:"
    ),
    url: "https://www.youtube.com/watch?v=leQESKoN9vU",
  },
  "manage-buildings": {
    title: "Manage Buildings",
    description: NewlineText(
      "In this page, you can add, edit or remove buildings. You can also use the search function to facilitate finding the building you're looking for.\nRefer to the video below for details on the execution of such:"
    ),
    url: "https://www.youtube.com/watch?v=4ulg0abR0RY",
  },
  "manage-meter-models": {
    title: "Manage Meter Models",
    description: NewlineText(
      "In this page, you can add, edit or remove meter models. You can also use the search function to facilitate finding the meter model you're looking for.\nRefer to the video below for details on the execution of such:"
    ),
    url: "https://www.youtube.com/watch?v=4ulg0abR0RY",
  },
  dashboard: {
    title: "Dashboard",
    description: NewlineText(
      "In this page, you can select up to five different meters to visualize either their consumption or demand in the last 24 hours, 7 days or 30 days.\nRefer to the video below for details on the execution of such:"
    ),
    url: "https://www.youtube.com/watch?v=1RTILtPa3qM",
  },
  about: {
    title: "About",
    description: NewlineText(
      "This is the about page. Here you'll find information about RUMergy and how it became to be."
    ),
    url: "",
  },
  "data-logging-scheduler": {
    title: "Data Logging Scheduler",
    description: NewlineText(
      "In this page, you can create a data logging schedule (data log) to obtain readings from a specific meter on a specific time frame.\nRefer to the video below for details on the execution of such:"
    ),
    url: "https://www.youtube.com/watch?v=wyssJ_lU2mk",
  },
  "data-logs": {
    title: "Data Logs",
    description: NewlineText(
      "In this page, you can view the data logs you've created. You can also download the results of ones that have been completed as a CSV file.\nRefer to the video below for details on the execution of such:"
    ),
    url: "https://www.youtube.com/watch?v=EEdCQrcdFDk",
  },
  "real-time-monitor": {
    title: "Real Time Monitor",
    description: NewlineText(
      "In this page, you can view real-time readings for an existing meter.\nRefer to the video below for details on the execution of such:"
    ),
    url: "",
  },
};

function NewlineText(text) {
  return text.split("\n").map((str, index) => <p key={index}>{str}</p>);
}

/** Displays help for current page */
function Help() {
  const [show, setShow] = useState(false);

  /**
   * Handles hiding the help modal.
   *
   * @function handleClose
   * */
  const handleClose = () => setShow(false);

  /**
   * Handles showing the help modal.
   *
   * @function handleShow
   * */
  const handleShow = () => setShow(true);

  const { url } = useRouteMatch();

  /**
   * Get the help data matching the current page.
   *
   * @function getMatching
   * @returns {object} Help data object
   * */
  const getMatching = () => {
    let key = url.split("/").at(-1);

    return key in helpData
      ? helpData[key]
      : {
          title: "No matching help found",
          description: "No help was found for the current page.",
          url: "",
        };
  };

  return (
    <>
      <IconButton
        icon={<FaQuestionCircle />}
        clickAction={() => {
          handleShow();
        }}
      />
      <HelpModal
        show={show}
        handleClose={handleClose}
        matching={getMatching()}
      />
    </>
  );
}

/** Modal to show help for current page */
function HelpModal(props) {
  return (
    <Modal
      centered
      size="lg"
      show={props.show}
      onHide={props.handleClose}
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <h4 className="bold">Help</h4>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col>
            <h4 className="bold">{props.matching.title}</h4>
            <p>{props.matching.description}</p>
          </Col>
        </Row>
        <Row>
          <Col className="d-flex flex-row justify-content-center">
            <ReactPlayer url={props.matching.url} />
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
}

HelpModal.propTypes = {
  /** Determines whether modal should be shown */
  show: PropTypes.bool,
  handleClose: PropTypes.func,
  /** Help data matching current url */
  matching: PropTypes.object,
};

export default Help;
