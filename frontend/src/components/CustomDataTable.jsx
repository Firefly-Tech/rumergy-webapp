import React from "react";
import DataTable from "react-data-table-component";

/**
 * Custom style for react-data-table-component.
 *
 * @constant {object} customStyle
 * */
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

/** Data table wrapper with custom style */
function CustomDataTable(props) {
  return <DataTable customStyles={customStyle} {...props} />;
}

export default CustomDataTable;
