import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Col,
  Row,
  Modal,
  Button,
  Card,
  Spinner,
  InputGroup,
  FormControl,
  Form,
} from "react-bootstrap";
import SearchBar from "./SearchBar";
import IconButton from "./IconButton";
import {
  FaRedo,
  FaPlus,
  FaPen,
  FaTimes,
  FaSync,
  FaTrash,
  FaExclamation,
  FaCheck,
} from "react-icons/fa";
import DataTable, { createTheme } from "react-data-table-component";
import { Formik } from "formik";
import * as Yup from "yup";
import { useRequireAuth } from "../resources/use-require-auth";
import { roles } from "../resources/constants";
import ManagementBar from "./ManagementBar";
import CustomDataTable from "./CustomDataTable";
import MeterAddModal from "./MeterAddModal";
import MeterEditModal from "./MeterEditModal";

const emptyEditMeterEntry = {
  id: null,
  name: "",
  model: "",
  ip: "",
  port: "",
  building: "",
};

function ManageMeter(props) {
  const [loading, setLoading] = useState(false);
  const [meters, setMeters] = useState([]);

  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [filteredEntries, setFilteredEntries] = useState([]);

  const [selectedEditEntry, setSelectedEditEntry] =
    useState(emptyEditMeterEntry);

  const [showEdit, setShowEdit] = useState(false);
  const handleCloseEdit = () => setShowEdit(false);
  const handleShowEdit = () => setShowEdit(true);

  const [showAdd, setShowAdd] = useState(false);
  const handleCloseAdd = () => setShowAdd(false);
  const handleShowAdd = () => setShowAdd(true);

  const auth = useRequireAuth("/admin/meters", [roles.Admin]); //change

  const testData = [
    {
      id: "1",
      name: "InnerYard",
      model: "Model 1",
      ip: "180.00.0.1",
      port: "502",
      building: "Stefani",
    },
    {
      id: "2",
      name: "Exterior",
      model: "Model 3",
      ip: "180.00.0.2",
      port: "502",
      building: "Biology",
    },
  ];

  useEffect(() => {
    fetchMeters();
  }, []);

  useEffect(() => {
    setLoading(true);
    setFilteredEntries(
      meters.filter(
        (meter) =>
          meter.meterString
            .toLowerCase()
            .includes(filterText.split(" ").join("").toLowerCase()) //Check this
      )
    );
    setLoading(false);
  }, [meters, filterText]);

 
  const fetchMeters = async () => {
    setLoading(true);
    let data = await auth.userAxiosInstance
      .get(`${auth.apiHost}/api/meter`)
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        return [];
      });
    console.log(data);
    if (data.length) {
      data = data.map((meter) => {
        let meterStringElements = [
          meter.id,
          meter.name,
          meter.ip,
          meter.port,
          meter.building,
        ];
        return { userString: meterStringElements.join(""), ...meter };
      });
    }
    setMeters(data);
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
    { name: "Name", selector: (row) => row.name, sortable: true },
    { name: "Model", selector: (row) => row.model, sortable: true },
    { name: "IP", selector: (row) => row.ip, sortable: true },
    { name: "Port", selector: (row) => row.port, sortable: true },
    { name: "Building", selector: (row) => row.building, sortable: true },
  ];

  const handleClear = () => {
    if (filterText) {
      setResetPaginationToggle(!resetPaginationToggle);
      setFilterText("");
    }
  };
  //handle edit y handle delete and add
  const handleAdd = async (values, { setSubmitting }) => {
    setLoading(true);
    let data = {
      name: values.name,
      model: values.model,
      ip: values.ip,
      port: values.port,
      building: values.building,
    };

    return auth.userAxiosInstance
      .post(`${auth.apiHost}/api/meters`, data)
      .then(() => {
        fetchMeters();
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
      ip: values.ip,
      port: values.port,
      building: values.building,
    };

    return auth.userAxiosInstance
      .patch(`${auth.apiHost}/api/meters/${id}/`, data) //ask about this
      .then(() => {
        fetchMeters();
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
      .delete(`${auth.apiHost}/api/meters/${id}/`)
      .then(() => {
        fetchMeters();
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
                onRefresh={fetchMeters}
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
                data={testData}
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
      />
      <MeterAddModal
        show={showAdd}
        handleClose={handleCloseAdd}
        handleSubmit={handleAdd}
      />
    </>
  );
}

export default ManageMeter;
