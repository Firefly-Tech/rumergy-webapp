import React, { useState, useEffect } from "react";
import { Col, Row, Spinner } from "react-bootstrap";
import IconButton from "./IconButton";
import { FaPen } from "react-icons/fa";
import { useRequireAuth } from "../resources/use-require-auth";
import { roles } from "../resources/constants";
import ManagementBar from "./ManagementBar";
import CustomDataTable from "./CustomDataTable";
import MeterModelAddModal from "./MeterModelAddModal";
import MeterModelEditModal from "./MeterModelEditModal";
import { buildStatus } from "../resources/helpers";

const emptyEditMeterModelEntry = {
  id: null,
  name: "",
  dataPoints: [],
};

function ManageMeterModels() {
  const [loading, setLoading] = useState(false);
  const [meterModels, setMeterModels] = useState([]);

  // Filter state
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [filteredEntries, setFilteredEntries] = useState([]);

  // Edit modal state
  const [selectedEditEntry, setSelectedEditEntry] = useState(
    emptyEditMeterModelEntry
  );
  const [showEdit, setShowEdit] = useState(false);
  const handleCloseEdit = () => setShowEdit(false);
  const handleShowEdit = () => setShowEdit(true);

  // Add modal state
  const [showAdd, setShowAdd] = useState(false);
  const handleCloseAdd = () => setShowAdd(false);
  const handleShowAdd = () => setShowAdd(true);

  const auth = useRequireAuth("/login", [roles.Admin]);

  useEffect(() => {
    /**
     * Initial meter model data fetch.
     *
     * @memberof ManageMeterModels
     * */
    fetchMeterModels();
  }, []);

  useEffect(() => {
    /**
     * Updates filtered entries if the filter text or
     * meter model list changes.
     *
     * @memberof ManageMeterModels
     * */
    setLoading(true);
    setFilteredEntries(
      meterModels.filter((meterModels) =>
        meterModels.meterModelString
          .toLowerCase()
          .includes(filterText.split(" ").join("").toLowerCase())
      )
    );
    setLoading(false);
  }, [meterModels, filterText]);

  /**
   * Handles fetching meter model data.
   *
   * @function fetchMeterModels
   * @async
   * */
  const fetchMeterModels = async () => {
    setLoading(true);

    let data = await auth.userAxiosInstance
      .get(`${auth.apiHost}/api/meter-models`)
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        return [];
      });

    if (data.length) {
      data = await Promise.all(
        data.map(async (meterModel) => {
          // Don't need meters so remove
          let { meters, ...model } = meterModel;

          // Get data points
          let dataPoints = await Promise.all(
            model.data_points.map(async (dataPointId) => {
              return auth
                .userAxiosInstance(
                  `${auth.apiHost}/api/data-points/${dataPointId}`
                )
                .then((res) => {
                  return res.data;
                });
            })
          );
          dataPoints = dataPoints.map((dataPoint) => {
            return {
              id: dataPoint.id,
              name: dataPoint.name,
              unit: dataPoint.unit,
              startAddress: dataPoint.start_address,
              endAddress: dataPoint.end_address,
              dataType: dataPoint.data_type,
              registerType: dataPoint.register_type,
            };
          });

          let dataPointNames = dataPoints.map((dataPoint) => {
            return dataPoint.name;
          });

          let meterModelStringElements = [
            meterModel.id,
            meterModel.name,
            dataPointNames.join(""),
          ];

          return {
            id: model.id,
            name: model.name,
            dataPoints: dataPoints,
            dataPointNames: dataPointNames.join(", "),
            meterModelString: meterModelStringElements.join(""),
          };
        })
      );
    }
    setMeterModels(data);
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
    {
      name: "Data Points",
      selector: (row) => row.dataPointNames,
      wrap: true,
    },
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
   * Handles adding a new meter model.
   *
   * @function handleAdd
   * @param {object} values - Formik object with form values
   * @param {function} setSubmitting - Formik function to handle submitting state
   * @returns {object} Object with operation status.
   * @async
   * */
  const handleAdd = async (values, { setSubmitting }) => {
    setLoading(true);

    // Meter model post data
    let meterModelData = {
      name: values.name,
    };

    // Post meter model
    let meterModel = await auth.userAxiosInstance
      .post(`${auth.apiHost}/api/meter-models/`, meterModelData)
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        return null;
      });

    if (!meterModel) {
      setLoading(false);
      setSubmitting(false);
      return buildStatus(false, "Failed to create meter model.");
    }

    // Data points post data array
    let dataPointsData = values.dataPoints.map((dataPoint) => {
      return {
        name: dataPoint.name.toLowerCase(),
        model: meterModel.id,
        unit: dataPoint.unit.toLowerCase(),
        start_address: dataPoint.startAddress,
        end_address: dataPoint.endAddress,
        data_type: dataPoint.dataType,
        register_type: dataPoint.registerType,
      };
    });

    // Create data points
    let status = buildStatus(true);
    for (let i = 0; i < dataPointsData.length; i++) {
      await auth.userAxiosInstance
        .post(`${auth.apiHost}/api/data-points/`, dataPointsData[i])
        .catch(() => {
          status = buildStatus(
            false,
            `Failed to create data point: ${dataPointsData[i].name}`
          );
        });
      if (!status.success) break;
    }

    fetchMeterModels();
    setSubmitting(false);
    setLoading(false);

    return status;
  };

  /**
   * Handles editing a meter model entry.
   *
   * @function handleEdit
   * @param {object} values - Formik object with form values
   * @param {function} setSubmitting - Formik function to handle submitting state
   * @returns {object} Object with operation status.
   * @async
   * */
  const handleEdit = async (values, { setSubmitting }) => {
    setLoading(true);

    // Meter model update data
    let meterModelData = {
      name: values.name,
    };

    let status = buildStatus(true);
    await auth.userAxiosInstance
      .patch(
        `${auth.apiHost}/api/meter-models/${selectedEditEntry.id}/`,
        meterModelData
      )
      .catch(() => {
        status = buildStatus(false, "Failed to update meter model.");
      });
    if (!status.success) {
      setSubmitting(false);
      setLoading(false);
      return status;
    }

    let dataPointsData = values.dataPoints.map((dataPoint) => {
      return {
        id: "id" in dataPoint ? dataPoint.id : null,
        name: dataPoint.name.toLowerCase(),
        model: selectedEditEntry.id,
        unit: dataPoint.unit.toLowerCase(),
        start_address: dataPoint.startAddress,
        end_address: dataPoint.endAddress,
        data_type: dataPoint.dataType,
        register_type: dataPoint.registerType,
      };
    });

    for (let i = 0; i < dataPointsData.length; i++) {
      // New datapoint
      if (!dataPointsData[i].id) {
        await auth.userAxiosInstance
          .post(`${auth.apiHost}/api/data-points/`, dataPointsData[i])
          .catch(() => {
            status = buildStatus(
              false,
              `Failed to create data point: ${dataPointsData[i].name}`
            );
          });
      } else {
        await auth.userAxiosInstance
          .patch(
            `${auth.apiHost}/api/data-points/${dataPointsData[i].id}/`,
            dataPointsData[i]
          )
          .catch(() => {
            status = buildStatus(
              false,
              `Failed to update data point: ${dataPointsData[i].name}`
            );
          });
      }

      if (!status.success) {
        setSubmitting(false);
        setLoading(false);
        return status;
      }
    }

    let filteredDataPointsData = dataPointsData.filter(
      (dataPoint) => dataPoint.id !== null
    );

    // Data point deletion
    if (filteredDataPointsData.length < selectedEditEntry.dataPoints.length) {
      let originalIDs = selectedEditEntry.dataPoints.map((dataPoint) => {
        return dataPoint.id;
      });
      let newIDs = filteredDataPointsData.map((dataPoint) => {
        return dataPoint.id;
      });

      for (let i = 0; i < originalIDs.length; i++) {
        if (newIDs.includes(originalIDs[i])) continue;
        await auth.userAxiosInstance
          .delete(`${auth.apiHost}/api/data-points/${originalIDs[i]}/`)
          .catch(() => {
            status = buildStatus(
              false,
              `Failed to delete data point: ${selectedEditEntry.dataPoints[i].name}`
            );
          });
        if (!status.success) break;
      }
    }

    fetchMeterModels();
    setSubmitting(false);
    setLoading(false);

    return status;
  };

  const handleDelete = async (id, { setSubmitting }) => {
    setLoading(true);

    return auth.userAxiosInstance
      .delete(`${auth.apiHost}/api/meter-models/${id}/`)
      .then(() => {
        fetchMeterModels();
        return buildStatus(true);
      })
      .catch(() => {
        return buildStatus(false, "Failed to delete meter model.");
      })
      .finally(() => {
        setSubmitting(false);
        setLoading(false);
      });
  };

  return (
    <>
      <Row className="h-100">
        <Col className="d-flex-column px-4 pt-4">
          <Row>
            <Col
              sm={12}
              className="d-flex flex-row align-items-center pb-4 gap-4"
            >
              <h1 className="bold">Meter Models</h1>
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
                addText={"Add new meter model"}
                handleClear={handleClear}
                onRefresh={fetchMeterModels}
                onAdd={handleShowAdd}
              />
            </Col>
          </Row>
          <Row>
            <Col className="meter-model-table">
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
      <MeterModelAddModal
        show={showAdd}
        handleClose={handleCloseAdd}
        handleSubmit={handleAdd}
      />
      <MeterModelEditModal
        show={showEdit}
        handleClose={handleCloseEdit}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        selectedEditEntry={selectedEditEntry}
      />
    </>
  );
}

export default ManageMeterModels;
