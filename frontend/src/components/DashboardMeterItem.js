import React from "react";
import PropTypes from "prop-types";
import IconButton from "./IconButton";
import { FaPlus, FaMinus } from "react-icons/fa";

function DashboardMeterItem(props) {
  return (
    <div className="meter-item mb-3">
      <span className="meter-name">{props.meter.name}</span>
      <div className="meter-item-button">
        <IconButton
          icon={(props.isAdd && <FaPlus />) || <FaMinus />}
          clickAction={() => props.clickAction(props.meter)}
        />
      </div>
    </div>
  );
}

DashboardMeterItem.propTypes = {
  meter: PropTypes.object,
  clickAction: PropTypes.func,
  isAdd: PropTypes.bool,
};

export default DashboardMeterItem;
