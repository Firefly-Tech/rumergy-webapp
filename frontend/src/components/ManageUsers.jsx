import React, { useState, useEffect } from "react";
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
} from "react-bootstrap";
import DataTable, { createTheme } from "react-data-table-component";
import IconButton from "./IconButton";
import { FaPen, FaRedo, FaPlus, FaTimes } from "react-icons/fa";
import SearchBar from "./SearchBar";
import { Formik } from "formik";
import * as Yup from "yup";

function ManageUsers() {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [filteredEntries, setFilteredEntries] = useState([]);

  const [selectedEntry, setSelectedEntry] = useState(null);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const auth = useRequireAuth("/login", [roles.Admin]);

  const getUsers = async () => {
    return auth.userAxiosInstance
      .get(`${auth.apiHost}/api/users`)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        return [];
      });
  };

  useEffect(async () => {
    setLoading(true);
    let data = await getUsers();
    if (!data.length) setUsers(data);
    setUsers(
      data.map((user) => {
        let userString = `${user.id}${user.username}${user.email}${user.profile.first_name}${user.profile.last_name}${user.profile.role}`;

        return { userString: userString, ...user };
      })
    );
    setLoading(false);
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

  const columns = [
    {
      name: "Action",
      cell: (row) => (
        <IconButton
          icon={<FaPen className="fs-5" />}
          clickAction={() => {
            setSelectedEntry(row);
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
                    clickAction={() => {}}
                  />
                  <Button
                    variant="primary"
                    className="d-flex flex-row align-items-center gap-3"
                    onClick={() => {
                      setSelectedEntry(null);
                      handleShow();
                    }}
                  >
                    <FaPlus className="fs-5" />
                    <span className="d-none d-sm-inline">
                      {"Add new meter"}
                    </span>
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
      <Modal centerd size="lg" show={show} onHide={handleClose}></Modal>
    </>
  );
}

export default ManageUsers;
