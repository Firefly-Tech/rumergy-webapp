import { React, useState } from "react";
import PropTypes from "prop-types";
import DashboardMeterItem from "./DashboardMeterItem";
import { FaSearch, FaTimes } from "react-icons/fa";
import IconButton from "./IconButton";
import { Row, Col } from "react-bootstrap";
import SearchBar from "./SearchBar";

function DashboardSelectedMeters(props) {
  const [searchActive, setSearchActive] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const toggleSearch = () => {
    setSearchActive(!searchActive);
  };

  const meterSearch = (input) => {
    setSearchResults(
      input
        ? props.selectedMeters.filter((meterName) => {
            return meterName.toLowerCase().includes(input.toLowerCase());
          })
        : []
    );
  };

  return (
    <div className="content-card">
      <Row>
        <Col className="d-flex align-items-center">
          {(searchActive && (
            <SearchBar label={"Search"} searchFunction={meterSearch} />
          )) || <h3 className="bold text-center mb-0">Selected meters</h3>}
          <div className="meter-select-search-button">
            <IconButton
              className="search-button"
              icon={<FaSearch />}
              clickAction={toggleSearch}
            />
          </div>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col className="d-flex flex-column px-6">
          {props.selectedMeters.length !== 0 ? (
            searchActive ? (
              searchResults.map((meterName, index) => {
                return (
                  <DashboardMeterItem
                    meterName={meterName}
                    key={index}
                    clickAction={props.deselectMeter}
                    isAdd={false}
                  />
                );
              })
            ) : (
              props.selectedMeters.map((meterName, index) => {
                return (
                  <DashboardMeterItem
                    meterName={meterName}
                    key={index}
                    clickAction={props.deselectMeter}
                    isAdd={false}
                  />
                );
              })
            )
          ) : (
            <h3 className="text-center">No meters selected</h3>
          )}
        </Col>
      </Row>
      <Row className="mt-2">
        <Col className="d-flex">
          {props.selectedMeters.length !== 0 && !searchActive && (
            <div className="meter-select-footer-button">
              <IconButton
                icon={<FaTimes />}
                optionalText={"Clear all"}
                clickAction={props.clearSelected}
              />
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
}

DashboardSelectedMeters.propTypes = {
  selectedMeters: PropTypes.array,
  deselectMeter: PropTypes.func,
  clearSelected: PropTypes.func,
};

export default DashboardSelectedMeters;
