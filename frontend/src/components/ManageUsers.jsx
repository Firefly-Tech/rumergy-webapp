import React, { useState, useEffect } from "react";
import { useRequireAuth } from "../resources/use-require-auth";
import { roles } from "../resources/constants";
import { Row, Col, Spinner } from "react-bootstrap";
import IconButton from "./IconButton";
import { FaPen } from "react-icons/fa";
import UserEditModal from "./UserEditModal";
import UserAddModal from "./UserAddModal";
import ManagementBar from "./ManagementBar";
import CustomDataTable from "./CustomDataTable";

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

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    setLoading(true);
    setFilteredEntries(
      users.filter((user) =>
        user.userString
          .toLowerCase()
          .includes(filterText.split(" ").join("").toLowerCase())
      )
    );
    setLoading(false);
  }, [users, filterText]);

  const fetchUsers = async () => {
    setLoading(true);
    const appUsername = process.env.REACT_APP_RUMERGY_USER;
    let data = await auth.userAxiosInstance
      .get(`${auth.apiHost}/api/users`)
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        return [];
      });

    // Filter out app user so it can't be modified
    data = data.filter((user) => user.username != appUsername);

    if (data.length) {
      data = data.map((user) => {
        let userStringElements = [
          user.id,
          user.username,
          user.email,
          user.profile.first_name,
          user.profile.last_name,
          user.profile.role,
        ];

        return { userString: userStringElements.join(""), ...user };
      });
    }
    setUsers(data);
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
              <ManagementBar
                filterText={filterText}
                setFilterText={setFilterText}
                loading={loading}
                addButton
                addText={"Add new user"}
                handleClear={handleClear}
                onRefresh={fetchUsers}
                onAdd={handleShowAdd}
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
