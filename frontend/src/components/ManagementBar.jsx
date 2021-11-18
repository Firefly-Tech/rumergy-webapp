import React from "react";
import PropTypes from "prop-types";
import { Card, Button, InputGroup, FormControl } from "react-bootstrap";
import { FaPlus, FaTimes, FaRedo } from "react-icons/fa";
import IconButton from "./IconButton";

/** Bar for admin management screens */
function ManagementBar(props) {
  return (
    <Card className="manage-card d-flex flex-row align-items-center py-3">
      <div className="me-auto px-3">
        <InputGroup>
          <FormControl
            placeholder="Filter entries"
            value={props.filterText}
            onChange={(e) => {
              props.setFilterText(e.target.value);
            }}
            disabled={props.loading}
          />
          <Button
            variant="primary"
            onClick={props.handleClear}
            disabled={props.loading}
          >
            <FaTimes className="fs-5" />
          </Button>
        </InputGroup>
      </div>
      <div className="d-flex flex-row align-items-center px-4 gap-4">
        <IconButton
          icon={<FaRedo className="fs-5" />}
          clickAction={props.onRefresh}
        />
        {props.addButton && (
          <Button
            variant="primary"
            className="d-flex flex-row align-items-center gap-3"
            onClick={props.onAdd}
          >
            <FaPlus className="fs-5" />
            <span className="d-none d-sm-inline">{props.addText}</span>
          </Button>
        )}
      </div>
    </Card>
  );
}

ManagementBar.propTypes = {
  /** Search bar text value */
  filterText: PropTypes.string,
  setFilterText: PropTypes.func,
  loading: PropTypes.bool,
  /** Determines if add button is desired */
  addButton: PropTypes.bool,
  /** Text for add button */
  addText: PropTypes.string,
  /** Clear handler for search bar */
  handleClear: PropTypes.func,
  /** Refresh handler */
  onRefresh: PropTypes.func,
  /** Add handler */
  onAdd: PropTypes.func,
};

export default ManagementBar;
