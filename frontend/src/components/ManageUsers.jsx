import React, { useState, useEffect } from "react";
import { useRequireAuth } from "../resources/use-require-auth";
import { roles } from "../resources/constants";
import {
  Row,
  Col,
  Spinner,
  Button,
  Card,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import DataTable from "react-data-table-component";
import IconButton from "./IconButton";
import { FaPen, FaRedo, FaPlus, FaTimes } from "react-icons/fa";
import UserEditModal from "./UserEditModal";
import UserAddModal from "./UserAddModal";

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

  // Filter state
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [filteredEntries, setFilteredEntries] = useState([]);

  // Edit modal state
  const [selectedEditEntry, setSelectedEditEntry] =
    useState(emptyEditUserEntry);
  const [showEdit, setShowEdit] = useState(false);
  const handleCloseEdit = () => setShowEdit(false);
  const handleShowEdit = () => setShowEdit(true);

  // Add modal state
  const [showAdd, setShowAdd] = useState(false);
  const handleCloseAdd = () => setShowAdd(false);
  const handleShowAdd = () => setShowAdd(true);

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
            handleShowEdit();
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

  const handleAdd = async (values, { setSubmitting }) => {
    setLoading(true);
    let data = {
      username: values.username,
      email: values.email,
      password: values.password,
      profile: {
        first_name: values.firstName,
        last_name: values.lastName,
        role: values.role,
      },
    };

    return auth.userAxiosInstance
      .post(`${auth.apiHost}/api/users/`, data)
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
                      handleShowAdd();
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
        show={showEdit}
        handleClose={handleCloseEdit}
        selectedEditEntry={selectedEditEntry}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
      <UserAddModal
        show={showAdd}
        handleClose={handleCloseAdd}
        handleSubmit={handleAdd}
      />
    </>
  );
}

export default ManageUsers;
