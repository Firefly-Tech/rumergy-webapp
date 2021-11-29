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
    description: "this is description",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  "manage-meter-models": {
    title: "Manage Meter Models",
    description: "This is the description",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  dashboard: {
    title: "Dashboard",
    description:
      'contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.',
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
};

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
