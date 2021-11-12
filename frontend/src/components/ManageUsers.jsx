import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useRequireAuth } from "../resources/use-require-auth";
import { roles } from "../resources/constants";
import {
  Row,
  Col,
  Spinner,
  Button,
  Modal,
  Card,
  InputGroup,
  FormControl,
  Form,
} from "react-bootstrap";
import DataTable from "react-data-table-component";
import IconButton from "./IconButton";
import {
  FaPen,
  FaRedo,
  FaPlus,
  FaTimes,
  FaSync,
  FaTrash,
  FaExclamation,
  FaCheck,
} from "react-icons/fa";
import { Formik } from "formik";
import * as Yup from "yup";

const userEditFormSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(1, "Must be at least 1 character")
    .max(50, "Must be at most 50 characters")
    .required("First name is required")
    .matches(/\b([A-ZÀ-ÿ][-,a-z. ']+[ ]*)+/, "Invalid format"),
  lastName: Yup.string()
    .min(1, "Must be at least 1 character")
    .max(50, "Must be at most 50 characters")
    .required("Last name is required")
    .matches(/\b([A-ZÀ-ÿ][-,a-z. ']+[ ]*)+/, "Invalid format"),
  email: Yup.string().email("Invalid email format").required("Email required"),
  role: Yup.string().required("Role required").oneOf(Object.values(roles)),
});

const emptyEditUserEntry = {
  id: null,
  profile: {
    first_name: "",
    last_name: "",
    role: "",
  },
  email: "",
};

function ManageUsers() {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [filteredEntries, setFilteredEntries] = useState([]);

  // Modal
  const [selectedEditEntry, setSelectedEditEntry] =
    useState(emptyEditUserEntry);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const auth = useRequireAuth("/login", [roles.Admin]);

  useEffect(async () => {
    await fetchUsers();
  }, []);

  useEffect(() => {
    setLoading(true);
    setFilteredEntries(
      users.filter((user) =>
        user.userString.toLowerCase().includes(filterText.toLowerCase())
      )
    );
    setLoading(false);
  }, [users, filterText]);

  const fetchUsers = async () => {
    setLoading(true);
    let data = await auth.userAxiosInstance
      .get(`${auth.apiHost}/api/users`)
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        return [];
      });
    if (!data.length) setUsers(data);
    setUsers(
      data.map((user) => {
        let userString = `${user.id}${user.username}${user.email}${user.profile.first_name}${user.profile.last_name}${user.profile.role}`;

        return { userString: userString, ...user };
      })
    );
    setLoading(false);
  };

  const columns = [
    {
      name: "Action",
      cell: (row) => (
        <IconButton
          icon={<FaPen className="fs-5" />}
          clickAction={() => {
            setSelectedEditEntry(row);
            handleShow();
          }}
        />
      ),
      button: true,
      allowOverflow: true,
    },
    { name: "ID", selector: (row) => row.id, sortable: true },
    { name: "Username", selector: (row) => row.username, sortable: true },
    { name: "Email", selector: (row) => row.email, sortable: true },
    {
      name: "First Name",
      selector: (row) => row.profile.first_name,
      sortable: true,
    },
    {
      name: "Last Name",
      selector: (row) => row.profile.last_name,
      sortable: true,
    },
    { name: "Role", selector: (row) => row.profile.role, sortable: true },
  ];

  const customStyle = {
    headRow: {
      style: {
        fontSize: "16px",
        backgroundColor: "#f2f3f8",
        borderBottomStyle: "none",
      },
    },
    rows: {
      style: {
        fontSize: "14px",
      },
    },
    pagination: {
      style: {
        backgroundColor: "#f2f3f8",
        borderTopStyle: "none",
      },
    },
  };

  const handleClear = () => {
    if (filterText) {
      setResetPaginationToggle(!resetPaginationToggle);
      setFilterText("");
    }
  };

  const handleEdit = async (id, values, { setSubmitting }) => {
    setLoading(true);
    let data = {
      profile: {
        first_name: values.firstName,
        last_name: values.lastName,
        role: values.role,
      },
      email: values.email,
    };
    return auth.userAxiosInstance
      .patch(`${auth.apiHost}/api/users/${id}/`, data)
      .then(() => {
        fetchUsers();
        return true;
      })
      .catch(() => {
        return false;
      })
      .finally(() => {
        setSubmitting(false);
        setLoading(false);
      });
  };

  const handleDelete = (id, { setSubmitting }) => {
    setLoading(true);
    return auth.userAxiosInstance
      .delete(`${auth.apiHost}/api/users/${id}/`)
      .then(() => {
        fetchUsers();
        return true;
      })
      .catch(() => {
        return false;
      })
      .finally(() => {
        setSubmitting(false);
        setLoading(false);
      });
  };

  return (
    <>
      {/* HEADER */}
      <Row className="h-100">
        <Col className="d-flex flex-column px-4 pt-4">
          <Row>
            <Col
              sm={12}
              className="d-flex flex-row align-items-center pb-4 gap-4"
            >
              <h1 className="bold mb-0">Users</h1>
              {loading && <Spinner variant="secondary" animation="border" />}
            </Col>
          </Row>
          <Row className="pb-5">
            <Col sm={12}>
              <Card className="manage-card d-flex flex-row align-items-center py-3">
                <div className="me-auto px-3">
                  <InputGroup>
                    <FormControl
                      placeholder="Filter entries"
                      value={filterText}
                      onChange={(e) => {
                        setFilterText(e.target.value);
                      }}
                      disabled={loading}
                    />
                    <Button
                      variant="primary"
                      onClick={handleClear}
                      disabled={loading}
                    >
                      <FaTimes className="fs-5" />
                    </Button>
                  </InputGroup>
                </div>
                <div className="d-flex flex-row align-items-center px-4 gap-4">
                  <IconButton
                    icon={<FaRedo className="fs-5" />}
                    clickAction={() => {
                      fetchUsers();
                    }}
                  />
                  <Button
                    variant="primary"
                    className="d-flex flex-row align-items-center gap-3"
                    onClick={() => {
                      setSelectedEditEntry(null);
                      handleShow();
                    }}
                  >
                    <FaPlus className="fs-5" />
                    <span className="d-none d-sm-inline">{"Add new user"}</span>
                  </Button>
                </div>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col className="user-table">
              <DataTable
                columns={columns}
                data={filteredEntries}
                theme="rumergy"
                progressPending={loading}
                customStyles={customStyle}
                pagination
                highlightOnHover
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <UserEditModal
        show={show}
        handleClose={handleClose}
        selectedEditEntry={selectedEditEntry}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </>
  );
}

function UserEditModal(props) {
  const [isUpdate, setIsUpdate] = useState(false);
  const [isDelete, setIsDelete] = useState(false);

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const resetAll = () => {
    setIsUpdate(false);
    setIsDelete(false);
    setSuccess(false);
    setError(false);
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
          <h4 className="bold">Edit Entry</h4>
        </Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={{
          firstName: props.selectedEditEntry.profile.first_name,
          lastName: props.selectedEditEntry.profile.last_name,
          email: props.selectedEditEntry.email,
          role: props.selectedEditEntry.profile.role,
        }}
        validationSchema={userEditFormSchema}
        onSubmit={async (values, handlers) => {
          let status;
          if (isUpdate) {
            status = await props.handleEdit(
              props.selectedEditEntry.id,
              values,
              handlers
            );
          } else {
            console.log("delete");
            status = await props.handleDelete(
              props.selectedEditEntry.id,
              handlers
            );
          }
          if (status) setSuccess(true);
          else setError(true);
        }}
        enableReinitialize
      >
        {(formik) => (
          <>
            <Form
              onSubmit={formik.handleSubmit}
              noValidate
              className="d-flex flex-column"
            >
              <Modal.Body>
                <Form.Group className="mb-3">
                  <Form.Label>First Name</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      id="firstName"
                      placeholder="Enter first name"
                      isInvalid={!!formik.errors.firstName}
                      {...formik.getFieldProps("firstName")}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.firstName}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Last Name</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      id="lastName"
                      placeholder="Enter last name"
                      isInvalid={!!formik.errors.lastName}
                      {...formik.getFieldProps("lastName")}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.lastName}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Role</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Select
                      id="role"
                      placeholder="Select role"
                      isInvalid={!!formik.errors.role}
                      {...formik.getFieldProps("role")}
                    >
                      {Object.keys(roles).map((key, index) => (
                        <option key={index} value={roles[key]}>
                          {key}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.role}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      id="email"
                      placeholder="Enter email"
                      isInvalid={!!formik.errors.email}
                      {...formik.getFieldProps("email")}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.email}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Modal.Body>
              <Modal.Footer className="d-flex flex-column">
                {success || error ? (
                  <Row>
                    <Col className="d-flex flex-row gap-2 align-items-center">
                      {success ? (
                        <>
                          <FaCheck />
                          Operation was successful
                        </>
                      ) : (
                        <>
                          <FaExclamation />
                          An error occured. Please try again.
                        </>
                      )}
                    </Col>
                  </Row>
                ) : (
                  <>
                    {isUpdate || isDelete ? (
                      <Row className="mb-3">
                        <Col>
                          {`Are you sure you wish to ${
                            isUpdate ? "update" : "delete"
                          } this entry?`}
                        </Col>
                      </Row>
                    ) : null}
                    <Row>
                      <Col className="d-flex flex-row gap-4 justify-content-center align-items-center mx-auto">
                        {isUpdate || isDelete ? (
                          <>
                            <Button
                              type="submit"
                              variant={isUpdate ? "primary" : "danger"}
                              className={`d-flex flex-row align-items-center gap-2 ${
                                isDelete ? "text-white" : ""
                              }`}
                            >
                              {isUpdate ? (
                                <>
                                  <FaSync />
                                  Update
                                </>
                              ) : (
                                <>
                                  <FaTrash />
                                  Delete
                                </>
                              )}
                            </Button>
                            <Button
                              variant="secondary"
                              className="d-flex flex-row align-items-center gap-2 text-white"
                              onClick={(e) => {
                                e.preventDefault();
                                setIsUpdate(false);
                                setIsDelete(false);
                              }}
                            >
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="primary"
                              className="d-flex flex-row align-items-center gap-2"
                              onClick={(e) => {
                                e.preventDefault();
                                setIsUpdate(true);
                              }}
                            >
                              <FaSync />
                              Update
                            </Button>
                            <Button
                              variant="danger"
                              className="d-flex flex-row align-items-center gap-2 text-white"
                              onClick={(e) => {
                                e.preventDefault();
                                setIsDelete(true);
                              }}
                            >
                              <FaTrash />
                              Delete
                            </Button>
                          </>
                        )}
                      </Col>
                    </Row>
                  </>
                )}
              </Modal.Footer>
            </Form>
          </>
        )}
      </Formik>
    </Modal>
  );
}

UserEditModal.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
  selectedEditEntry: PropTypes.object,
  handleEdit: PropTypes.func,
  handleDelete: PropTypes.func,
};

export default ManageUsers;
