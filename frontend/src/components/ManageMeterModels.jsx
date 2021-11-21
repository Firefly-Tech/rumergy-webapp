import React, { useState, useEffect } from "react";
import { Col, Row, Spinner } from "react-bootstrap";
import IconButton from "./IconButton";
import { FaPen } from "react-icons/fa";
import { useRequireAuth } from "../resources/use-require-auth";
import { roles } from "../resources/constants";
import ManagementBar from "./ManagementBar";
import CustomDataTable from "./CustomDataTable";
import MeterModelAddModal from "./MeterModelAddModal";

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
    fetchMeterModels();
  }, []);

  useEffect(() => {
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

  //Datatable columns
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

  const handleClear = () => {
    if (filterText) {
      setResetPaginationToggle(!resetPaginationToggle);
      setFilterText("");
    }
  };

  const handleAdd = async (values, { setSubmitting }) => {
    setLoading(true);
    // Meter model post data
    let meterModelData = {
      name: values.name,
    };

    // Post meter model

    // Data points post data array
    let dataPointsData = values.dataPoints.map(dataPoint => {

    })

    return auth.userAxiosInstance
      .post(`${auth.apiHost}/api/meter-models`, meterModelData)
      .then(() => {
        fetchMeterModels();
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
      name: values.name,
      model: values.model,
      datafields: values.datafields,
    };

    return auth.userAxiosInstance
      .patch(`${auth.apiHost}/api/meter-models/${id}/`, data) //ask about this
      .then(() => {
        fetchMeterModels();
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

  const handleDelete = async (id, { setSubmitting }) => {
    setLoading(true);

    return auth.userAxiosInstance
      .delete(`${auth.apiHost}/api/meter-models/${id}/`)
      .then(() => {
        fetchMeterModels();
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
    </>
  );
}

export default ManageMeterModels;
