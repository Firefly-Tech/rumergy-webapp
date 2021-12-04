import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useRequireAuth } from "../resources/use-require-auth";
import { roles } from "../resources/constants";
import { Row, Col, Spinner, Button, Modal, Card } from "react-bootstrap";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaInfoCircle,
  FaCheck,
  FaExclamation,
} from "react-icons/fa";
import ManagementBar from "./ManagementBar";
import CustomDataTable from "./CustomDataTable";
import { parseISO, format } from "date-fns";
import { buildStatus } from "../resources/helpers";

/** Access request management screen for admins. */
function ManageAccessRequests() {
  const [loading, setLoading] = useState(false);
  const [accessRequests, setAccessRequests] = useState([]);

  // Filter state
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [filteredEntries, setFilteredEntries] = useState([]);

  const [selectedEntry, setSelectedEntry] = useState({});

  // Confirm modal state
  const [showConfirm, setShowConfirm] = useState(false);

  /**
   * Handles hiding the confirm modal.
   *
   * @function handleCloseConfirm
   * */
  const handleCloseConfirm = () => {
    setShowConfirm(false);
    setIsAccept(false);
    setIsReject(false);
  };

  /**
   * Handles showing the confirm modal.
   *
   * @function handleShowConfirm
   * */
  const handleShowConfirm = () => setShowConfirm(true);
  const [isAccept, setIsAccept] = useState(false);
  const [isReject, setIsReject] = useState(false);

  //  Info modal state
  const [showInfo, setShowInfo] = useState(false);

  /**
   * Handles hiding the info modal.
   *
   * @function handleCloseInfo
   * */
  const handleCloseInfo = () => setShowInfo(false);

  /**
   * Handles showing the info modal.
   *
   * @function handleShowConfirm
   * */
  const handleShowInfo = () => setShowInfo(true);

  const auth = useRequireAuth("/login", [roles.Admin]);

  useEffect(() => {
    /**
     * Fetch access request data on load.
     *
     * @memberof ManageAccessRequests
     * */
    fetchAccessRequests();
  }, []);

  useEffect(() => {
    /**
     * Updates filtered entries if the filter text or
     * access request list changes.
     *
     * @memberof ManageAccessRequests
     * */
    setLoading(true);
    setFilteredEntries(
      accessRequests.filter((accessRequest) =>
        accessRequest.accessRequestString
          .toLowerCase()
          .includes(filterText.split(" ").join("").toLowerCase())
      )
    );
    setLoading(false);
  }, [accessRequests, filterText]);

  /**
   * Fetch access request data.
   * Also does fetches corresponding user details.
   *
   * @function fetchAccessRequests
   * */
  const fetchAccessRequests = async () => {
    setLoading(true);
    // Get access request data
    let accessReqData = await auth.userAxiosInstance
      .get(`${auth.apiHost}/api/access-request`, { params: { status: "ACT" } })
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        return [];
      });
    let parsedAccessReqs = [];
    if (accessReqData.length) {
      // Get user details for each access request
      parsedAccessReqs = await Promise.all(
        accessReqData.map(async (accessReq) => {
          let user = await auth.userAxiosInstance
            .get(`${auth.apiHost}/api/users/${accessReq.user}`)
            .then((res) => {
              return res.data;
            });

          let timestamp = format(parseISO(accessReq.timestamp), "MMM d yyyy");

          // String containing all attributes for filtering
          let stringElements = [
            accessReq.id,
            user.username,
            user.email,
            user.profile.first_name,
            user.profile.last_name,
            accessReq.occupation,
            accessReq.justification,
            timestamp,
          ];

          return {
            ID: accessReq.id,
            Username: user.username,
            Email: user.email,
            "First Name": user.profile.first_name,
            "Last Name": user.profile.last_name,
            Occupation: accessReq.occupation,
            Justification: accessReq.justification,
            Timestamp: timestamp,
            accessRequestString: stringElements.join("").split(" ").join(""),
          };
        })
      );
    }
    setAccessRequests(parsedAccessReqs);
    setLoading(false);
  };

  /**
   * Columns for data table.
   *
   * @constant {object} columns
   * */
  const columns = [
    {
      name: "Action",
      cell: (row) => (
        <div className="d-flex flex-row gap-2">
          <Button
            size="sm"
            variant="primary"
            onClick={(e) => {
              e.preventDefault();
              setSelectedEntry(row);
              setIsAccept(true);
              handleShowConfirm();
            }}
          >
            <FaCheckCircle />
          </Button>
          <Button
            size="sm"
            variant="danger"
            className="text-white"
            onClick={(e) => {
              e.preventDefault();
              setSelectedEntry(row);
              setIsReject(true);
              handleShowConfirm();
            }}
          >
            <FaTimesCircle />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={(e) => {
              e.preventDefault();
              let { accessRequestString, ...rest } = row;
              setSelectedEntry(rest);
              handleShowInfo();
            }}
          >
            <FaInfoCircle />
          </Button>
        </div>
      ),
      button: true,
      minWidth: "140px",
    },
    { name: "ID", selector: (row) => row.ID, sortable: true },
    { name: "Username", selector: (row) => row.Username, sortable: true },
    { name: "Email", selector: (row) => row.Email, sortable: true },
    {
      name: "First Name",
      selector: (row) => row["First Name"],
      sortable: true,
    },
    {
      name: "Last Name",
      selector: (row) => row["Last Name"],
      sortable: true,
    },
    {
      name: "Occupation",
      selector: (row) => row.Occupation,
      sortable: true,
    },
    {
      name: "Justification",
      selector: (row) => row.Justification,
      maxWidth: "200px",
    },
    { name: "Submitted", selector: (row) => row.Timestamp, sortable: true },
  ];

  /**
   * Handles clearing the search bar.
   * Resets table pagination too.
   *
   * @function handleClear
   * */
  const handleClear = () => {
    if (filterText) {
      setResetPaginationToggle(!resetPaginationToggle);
      setFilterText("");
    }
  };

  /**
   * Handles accepting or rejecting
   * an access request.
   *
   * @function handleSubmit
   * @returns {object} Object with operation status.
   * */
  const handleSubmit = () => {
    setLoading(true);
    return auth.userAxiosInstance
      .put(
        `${auth.apiHost}/api/access-request/${selectedEntry.ID}/${
          isAccept ? "accept" : "reject"
        }/`
      )
      .then(() => {
        fetchAccessRequests();
        setSelectedEntry({});
        return buildStatus(true);
      })
      .catch(() => {
        return buildStatus(
          false,
          `Failed to ${isAccept ? "accept" : "reject"} access request.`
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <Row className="h-100">
        <Col className="d-flex flex-column px-4 pt-4">
          <Row>
            <Col
              sm={12}
              className="d-flex flex-row align-items-center pb-4 gap-4"
            >
              <h1 className="bold mb-0">Access Requests</h1>
              {loading && <Spinner variant="secondary" animation="border" />}
            </Col>
          </Row>
          <Row className="pb-5">
            <Col sm={12}>
              <ManagementBar
                filterText={filterText}
                setFilterText={setFilterText}
                loading={loading}
                handleClear={handleClear}
                onRefresh={fetchAccessRequests}
              />
            </Col>
          </Row>
          <Row>
            <Col className="user-table">
              <CustomDataTable
                columns={columns}
                data={filteredEntries}
                progressPending={loading}
                pagination
                highlightOnHover
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <ConfirmModal
        show={showConfirm}
        handleClose={handleCloseConfirm}
        handleSubmit={handleSubmit}
        isAccept={isAccept}
        isReject={isReject}
      />
      <InfoModal
        show={showInfo}
        handleClose={handleCloseInfo}
        selectedEntry={selectedEntry}
      />
    </>
  );
}

function ConfirmModal(props) {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const resetAll = () => {
    setSuccess(false);
    setError(false);
    setErrorMessage("");
  };

  return (
    <Modal
      centered
      size="lg"
      show={props.show}
      onHide={() => {
        props.handleClose();
        resetAll();
      }}
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <h4 className="bold">Confirm</h4>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col>
            {success || error ? (
              success ? (
                <Row>
                  <Col className="d-flex flex-row align-items-center gap-1 justify-content-center">
                    <FaCheck />
                    Operation was successful
                  </Col>
                </Row>
              ) : (
                <>
                  <Row className="mb-3">
                    <Col className="d-flex flex-row gap-2 align-items-center justify-content-center">
                      <FaExclamation />
                      {errorMessage}
                    </Col>
                  </Row>
                  <Row>
                    <Col className=" d-flex justify-content-center">
                      <Button
                        variant="primary"
                        onClick={(e) => {
                          e.preventDefault();
                          resetAll();
                        }}
                      >
                        Try again
                      </Button>
                    </Col>
                  </Row>
                </>
              )
            ) : (
              <Row>
                <Col className="d-flex justify-content-center">
                  {`Are you sure you wish to ${
                    props.isAccept ? "accept" : "reject"
                  } this request?`}
                </Col>
              </Row>
            )}
          </Col>
        </Row>
        <Row>
          <Col className="d-flex flex-row gap-3 justify-content-center mt-3">
            {!(success || error) ? (
              <>
                <Button
                  variant={props.isAccept ? "primary" : "danger"}
                  className={`d-flex flex-row gap-2 align-items-center ${
                    props.isReject ? "text-white" : ""
                  }`}
                  onClick={async (e) => {
                    e.preventDefault();
                    let status = await props.handleSubmit();
                    if (status.success) setSuccess(true);
                    else {
                      setError(true);
                      setErrorMessage(status.errorMessage);
                    }
                  }}
                >
                  {props.isAccept ? (
                    <>
                      <FaCheck />
                      Accept
                    </>
                  ) : (
                    <>
                      <FaTimesCircle />
                      Reject
                    </>
                  )}
                </Button>
                <Button
                  variant="secondary"
                  onClick={(e) => {
                    e.preventDefault();
                    resetAll();
                    props.handleClose();
                  }}
                >
                  Cancel
                </Button>
              </>
            ) : null}
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
}

function InfoModal(props) {
  return (
    <Modal
      centered
      size="lg"
      show={props.show}
      onHide={() => {
        props.handleClose();
      }}
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <h4 className="bold">Access Request Details</h4>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body as={Row} className="overflow-auto">
        <Col className="d-flex flex-column">
          {Object.keys(props.selectedEntry).map((key, index) => (
            <Card className="manage-card mb-3" key={index}>
              <Card.Body as={Row}>
                <Col className="d-flex flex-row gap-3 align-items-start">
                  <span className="text-break bold">{key}</span>
                  <span className="text-break">{props.selectedEntry[key]}</span>
                </Col>
              </Card.Body>
            </Card>
          ))}
        </Col>
      </Modal.Body>
    </Modal>
  );
}

ConfirmModal.propTypes = {
  /** Determines whether modal should be shown */
  show: PropTypes.bool,
  handleClose: PropTypes.func,
  /** Submission handler */
  handleSubmit: PropTypes.func,
  isAccept: PropTypes.bool,
  isReject: PropTypes.bool,
};

InfoModal.propTypes = {
  /** Determines whether modal should be shown */
  show: PropTypes.bool,
  handleClose: PropTypes.func,
  /** Selected access request */
  selectedEntry: PropTypes.object,
};

export default ManageAccessRequests;
