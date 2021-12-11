import React, { useState, useEffect } from "react";
import { Col, Row, Spinner } from "react-bootstrap";
import IconButton from "./IconButton";
import { FaPen } from "react-icons/fa";
import { useRequireAuth } from "../resources/use-require-auth";
import { roles } from "../resources/constants";
import ManagementBar from "./ManagementBar";
import CustomDataTable from "./CustomDataTable";
import MeterAddModal from "./MeterAddModal";
import MeterEditModal from "./MeterEditModal";
import { buildStatus } from "../resources/helpers";

/**
 * Initial value for selectedEditEntry
 *
 * @constant {object} emptyEditMeterEntry
 * */
const emptyEditMeterEntry = {
  id: "",
  name: "",
  meter_model: "",
  ip: "",
  port: "",
  building: "",
  substation: "",
  longitude: "",
  latitude: "",
  comments: "",
  panel_id: "",
  serial_number: "",
  status: "",
};

export const meterStatus = {
  Active: "ACT",
  Inactive: "INA",
  Error: "ERR",
};

/** Meter management screen for admins. */
function ManageMeter() {
  const [loading, setLoading] = useState(false);
  const [meters, setMeters] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [meterModels, setMeterModels] = useState([]);

  //Filter State
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [filteredEntries, setFilteredEntries] = useState([]);

  //Modal State
  const [selectedEditEntry, setSelectedEditEntry] =
    useState(emptyEditMeterEntry);

  const [showEdit, setShowEdit] = useState(false);
  const handleCloseEdit = () => setShowEdit(false);
  const handleShowEdit = () => setShowEdit(true);

  const [showAdd, setShowAdd] = useState(false);
  const handleCloseAdd = () => setShowAdd(false);
  const handleShowAdd = () => setShowAdd(true);

  const auth = useRequireAuth("/login", [roles.Admin]);

  useEffect(() => {
    /**
     * Fetch all data on load.
     *
     * @memberof ManageMeter
     * */
    fetchAllData();
  }, []);

  useEffect(() => {
    /**
     * Updates filtered entries if the filter text or
     * meter list changes.
     *
     * @memberof ManageMeter
     * */
    setLoading(true);
    setFilteredEntries(
      meters.filter(
        (meter) =>
          meter.meterString
            .toLowerCase()
            .includes(filterText.split(" ").join("").toLowerCase())
      )
    );
    setLoading(false);
  }, [meters, filterText]);

  /**
   * Wrapper for all data fetches
   *
   * @function fetchAllData
   * */
  const fetchAllData = () => {
    setLoading(true);
    fetchMeters();
    fetchBuildings();
    fetchMeterModels();
    setLoading(false);
  };

  /**
   * Fetches building data.
   *
   * @function fetchBuildings
   * @async
   * */
  const fetchBuildings = async () => {
    let data = await auth.userAxiosInstance
      .get(`${auth.apiHost}/api/buildings`)
      .then((res) => {
        return res.data;
      });
    setBuildings(
      data.map((building) => ({ name: building.name, id: building.id }))
    );
  };

  /**
   * Fetch meter model data.
   *
   * @function fetchMeterModels
   * @async
   * */
  const fetchMeterModels = async () => {
    let data = await auth.userAxiosInstance
      .get(`${auth.apiHost}/api/meter-models`)
      .then((res) => {
        return res.data;
      });
    setMeterModels(data.map((model) => ({ name: model.name, id: model.id })));
  };

  /**
   * Fetch meter data.
   *
   * @function fetchMeters
   * @async
   * */
  const fetchMeters = async () => {
    let data = await auth.userAxiosInstance
      .get(`${auth.apiHost}/api/meters`)
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        return [];
      });

    if (data.length) {
      data = await Promise.all(
        data.map(async (meter) => {
          let meterModel = await auth.userAxiosInstance
            .get(`${auth.apiHost}/api/meter-models/${meter.meter_model}`)
            .then((res) => {
              return res.data;
            });

          let building = await auth.userAxiosInstance
            .get(`${auth.apiHost}/api/buildings/${meter.building}`)
            .then((res) => {
              return res.data;
            });

          let meterStringElements = [
            // Build string with meter attributes
            // for filtering.
            meter.id,
            meter.name,
            meterModel.name,
            meter.ip,
            meter.port,
            building.name,
            meter.substation,
            meter.longitude,
            meter.latitude,
            meter.comments,
            meter.panel_id,
            meter.serial_number,
            meter.status,
          ];

          return {
            meterString: meterStringElements.join("").split(" ").join(""),
            meter_model: {name : meterModel.name, id: meterModel.id},
            building: {name: building.name, id: building.id},
            id: meter.id,
            name: meter.name,
            ip: meter.ip,
            port: meter.port,
            substation: meter.substation,
            longitude: meter.longitude,
            latitude: meter.latitude,
            comments: meter.comments,
            panel_id: meter.panel_id,
            serial_number: meter.serial_number,
            status: meter.status,
          };
        })
      );
    }
    setMeters(data);
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
    { name: "Model", selector: (row) => row.meter_model.name, sortable: true },
    { name: "IP", selector: (row) => row.ip, sortable: true },
    { name: "Port", selector: (row) => row.port, sortable: true },
    { name: "Building", selector: (row) => row.building.name, sortable: true },
    { name: "Substation", selector: (row) => row.substation, sortable: true },
    {
      name: "Coordinates",
      selector: (row) => `${row.latitude}, ${row.longitude}`,
      maxWidth: "150px",
    },
    {
      name: "Comments",
      selector: (row) => row.comments,
      maxWidth: "200px",
    },
    { name: "Panel ID", selector: (row) => row.panel_id, sortable: true },
    {
      name: "Serial Number",
      selector: (row) => row.serial_number,
      sortable: true,
    },
    { name: "Status", selector: (row) => row.status, sortable: true },
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
   * Handles adding a new meter.
   *
   * @function handleAdd
   * @param {object} values - Formik object with form values
   * @param {function} setSubmitting - Formik function to handle submitting state
   * @returns {object} Object with operation status.
   * @async
   * */
  const handleAdd = async (values, { setSubmitting }) => {
    setLoading(true);

    const checkEmpty = (value) => {
      return !!value ? value : "None";
    };

    let data = {
      name: values.name,
      meter_model: values.meter_model,
      ip: values.ip,
      port: values.port,
      building: values.building,
      status: values.status,
      substation: checkEmpty(values.substation),
      longitude: values.longitude === "" ? 0 : parseFloat(values.longitude),
      latitude: values.latitude === "" ? 0 : parseFloat(values.latitude),
      comments: checkEmpty(values.comments),
      panel_id: checkEmpty(values.panel_id),
      serial_number: checkEmpty(values.serial_number),
    };

    return auth.userAxiosInstance
      .post(`${auth.apiHost}/api/meters/`, data)
      .then(() => {
        fetchMeters();
        fetchMeterModels();
        fetchBuildings();
        return buildStatus(true);
      })
      .catch(() => {
        return buildStatus(false, "Failed to create meter.");
      })
      .finally(() => {
        setSubmitting(false);
        setLoading(false);
      });
  };

  /**
   * Handles editing a meter entry.
   *
   * @function handleEdit
   * @param {number} id - meter id
   * @param {object} values - Formik object with form values
   * @param {function} setSubmitting - Formik function to handle submitting state
   * @returns {object} Object with operation status.
   * @async
   * */
  const handleEdit = async (id, values, { setSubmitting }) => {
    setLoading(true);
    const checkEmpty = (value) => {
      return !!value ? value : "None";
    };

    let data = {
      name: values.name,
      meter_model: values.meter_model,
      ip: values.ip,
      port: values.port,
      building: values.building,
      status: values.status,
      substation: checkEmpty(values.substation),
      longitude: values.longitude === "" ? 0 : parseFloat(values.longitude),
      latitude: values.latitude === "" ? 0 : parseFloat(values.latitude),
      comments: checkEmpty(values.comments),
      panel_id: checkEmpty(values.panel_id),
      serial_number: checkEmpty(values.serial_number),
    };

    return auth.userAxiosInstance
      .patch(`${auth.apiHost}/api/meters/${id}/`, data)
      .then(() => {
        fetchMeters();
        fetchMeterModels();
        fetchBuildings();
        return buildStatus(true);
      })
      .catch(() => {
        return buildStatus(false, "Failed to update meter");
      })
      .finally(() => {
        setSubmitting(false);
        setLoading(false);
      });
  };

  /**
   * Handles deleting a meter entry.
   *
   * @function handleDelete
   * @param {number} id - meter id
   * @param {function} setSubmitting - Formik function to handle submitting state
   * @returns {object} Object with operation status.
   * @async
   * */
  const handleDelete = async (id, { setSubmitting }) => {
    setLoading(true);

    return auth.userAxiosInstance
      .delete(`${auth.apiHost}/api/meters/${id}/`)
      .then(() => {
        fetchMeters();
        fetchMeterModels();
        fetchBuildings();
        return buildStatus(true);
      })
      .catch(() => {
        return buildStatus(false, "Failed to delete meter");
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
              <h1 className="bold">Meters</h1>
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
                addText={"Add new meter"}
                handleClear={handleClear}
                onRefresh={fetchAllData}
                onAdd={handleShowAdd}
              />
            </Col>
          </Row>
          <Row>
            <Col className="meter-table">
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
      <MeterEditModal
        show={showEdit}
        handleClose={handleCloseEdit}
        selectedEditEntry={selectedEditEntry}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        meterModels={meterModels}
        buildings={buildings}
        loading={loading}
      />
      <MeterAddModal
        show={showAdd}
        handleClose={handleCloseAdd}
        handleSubmit={handleAdd}
        meterModels={meterModels}
        buildings={buildings}
        loading={loading}
      />
    </>
  );
}

export default ManageMeter;
