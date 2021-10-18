import { React, useState } from "react";
import PropTypes from "prop-types";
import DashboardMeterItem from "./DashboardMeterItem";
import { FaSearch } from "react-icons/fa";
import IconButton from "./IconButton";
import { Row, Col } from "react-bootstrap";

function DashboardSelectedMeters(props) {
  const [searchEnabled, setSearchEnabled] = useState(false);

  const toggleSearch = () => {
    setSearchEnabled(!searchEnabled);
  };

  return (
    <div className="content-card">
      <Row>
        <Col className="d-flex">
          {(searchEnabled && <div>searchy search</div>) || (
            <h3>Selected meters</h3>
          )}
          <div className="meter-select-search-button">
            <IconButton
              className="search-button"
              icon={<FaSearch />}
              clickAction={toggleSearch}
            />
          </div>
        </Col>
      </Row>
      <Row className="mt-2">
        <Col className="d-flex flex-column px-6">
          {props.selectedMeters.map((meterName, index) => {
            return (
              <DashboardMeterItem
                meterName={meterName}
                key={index}
                clickAction={props.deselectMeter}
                isAdd={false}
              />
            );
          })}
        </Col>
      </Row>
      <div className="content-card-footer"></div>
    </div>
  );
}

DashboardSelectedMeters.propTypes = {
  selectedMeters: PropTypes.array,
  deselectMeter: PropTypes.func,
};

export default DashboardSelectedMeters;
