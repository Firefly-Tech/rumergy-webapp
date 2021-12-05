import React, { useState, useEffect } from "react";
import { useRequireAuth } from "../resources/use-require-auth";
import { roles } from "../resources/constants";
import { Row, Col, Spinner } from "react-bootstrap";
import IconButton from "./IconButton";
import { FaPen } from "react-icons/fa";
import BuildingEditModal from "./BuildingEditModal";
import BuildingAddModal from "./BuildingAddModal";
import ManagementBar from "./ManagementBar";
import CustomDataTable from "./CustomDataTable";
import { buildStatus } from "../resources/helpers";

/**
 * Initial value for selectedEditEntry
 *
 * @constant {object} emptyEditBuildingEntry
 * */
const emptyEditBuildingEntry = {
  id: null,
  name: "",
};

/** Building management screen for admins. */
function ManageBuildings() {
  const [loading, setLoading] = useState(false);
  const [buildings, setBuildings] = useState([]);

  // Filter state
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [filteredEntries, setFilteredEntries] = useState([]);

  // Edit modal state
  const [selectedEditEntry, setSelectedEditEntry] = useState(
    emptyEditBuildingEntry
  );
  const [showEdit, setShowEdit] = useState(false);

  /**
   * Handles hiding the edit modal.
   *
   * @function handleCloseEdit
   * */
  const handleCloseEdit = () => setShowEdit(false);

  /**
   * Handles showing the edit modal.
   *
   * @function handleShowEdit
   * */
  const handleShowEdit = () => setShowEdit(true);

  // Add modal state
  const [showAdd, setShowAdd] = useState(false);

  /**
   * Handles hiding the add modal.
   *
   * @function handleCloseAdd
   * */
  const handleCloseAdd = () => setShowAdd(false);

  /**
   * Handles showing the add modal.
   *
   * @function handleShowAdd
   * */
  const handleShowAdd = () => setShowAdd(true);

  const auth = useRequireAuth("/login", [roles.Admin]);

  useEffect(() => {
    /**
     * Fetch buliding data on load.
     *
     * @memberof ManageBuildings
     * */
    fetchBuildings();
  }, []);

  useEffect(() => {
    /**
     * Updates filtered entries if the filter text or
     * building list changes.
     *
     * @memberof ManageBuildings
     * */
    setLoading(true);
    setFilteredEntries(
      buildings.filter((building) =>
        building.buildingString
          .toLowerCase()
          .includes(filterText.split(" ").join("").toLowerCase())
      )
    );
    setLoading(false);
  }, [buildings, filterText]);

  /**
   * Handles fetching building data.
   *
   * @function fetchBuildings
   * @async
   * */
  const fetchBuildings = async () => {
    setLoading(true);
    let data = await auth.userAxiosInstance
      .get(`${auth.apiHost}/api/buildings`)
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        return [];
      });

    if (data.length) {
      data = data.map((building) => {
        // Build string with building attributes
        // for filtering.
        let buildingStringElements = [building.id, building.name];

        return { buildingString: buildingStringElements.join(""), ...building };
      });
    }
    setBuildings(data);
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
    { name: "Name", selector: (row) => row.name, sortable: true },
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
   * Handles adding a new building.
   *
   * @function handleAdd
   * @param {object} values - Formik object with form values
   * @param {function} setSubmitting - Formik function to handle submitting state
   * @returns {object} Object with operation status.
   * @async
   * */
  const handleAdd = async (values, { setSubmitting }) => {
    setLoading(true);
    let data = {
      name: values.name,
    };

    return auth.userAxiosInstance
      .post(`${auth.apiHost}/api/buildings/`, data)
      .then(() => {
        fetchBuildings();
        return buildStatus(true);
      })
      .catch(() => {
        return buildStatus(false, "Failed to create building.");
      })
      .finally(() => {
        setSubmitting(false);
        setLoading(false);
      });
  };

  /**
   * Handles editing a building entry.
   *
   * @function handleEdit
   * @param {number} id - Building id
   * @param {object} values - Formik object with form values
   * @param {function} setSubmitting - Formik function to handle submitting state
   * @returns {object} Object with operation status.
   * @async
   * */
  const handleEdit = async (id, values, { setSubmitting }) => {
    setLoading(true);
    let data = {
      name: values.name,
    };

    return auth.userAxiosInstance
      .patch(`${auth.apiHost}/api/buildings/${id}/`, data)
      .then(() => {
        fetchBuildings();
        return buildStatus(true);
      })
      .catch(() => {
        return buildStatus(false, "Failed to update building.");
      })
      .finally(() => {
        setSubmitting(false);
        setLoading(false);
      });
  };

  /**
   * Handles deleting a building entry.
   *
   * @function handleDelete
   * @param {number} id - Building id
   * @param {function} setSubmitting - Formik function to handle submitting state
   * @returns {object} Object with operation status.
   * @async
   * */
  const handleDelete = (id, { setSubmitting }) => {
    setLoading(true);

    return auth.userAxiosInstance
      .delete(`${auth.apiHost}/api/buildings/${id}/`)
      .then(() => {
        fetchBuildings();
        return buildStatus(true);
      })
      .catch(() => {
        return buildStatus(false, "Failed to delete building.");
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
              <h1 className="bold mb-0">Buildings</h1>
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
                addText={"Add new building"}
                handleClear={handleClear}
                onRefresh={fetchBuildings}
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
      <BuildingEditModal
        show={showEdit}
        handleClose={handleCloseEdit}
        selectedEditEntry={selectedEditEntry}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
      <BuildingAddModal
        show={showAdd}
        handleClose={handleCloseAdd}
        handleSubmit={handleAdd}
      />
    </>
  );
}

export default ManageBuildings;
