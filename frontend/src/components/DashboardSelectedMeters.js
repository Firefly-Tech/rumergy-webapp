import { React, useState } from "react";
import PropTypes from "prop-types";
import DashboardMeterItem from "./DashboardMeterItem";
import { FaSearch, FaTimes } from "react-icons/fa";
import IconButton from "./IconButton";
import { Row, Col, Card } from "react-bootstrap";
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
    <Card className="meter-list-card mb-sm-5 flex-fill">
      <Card.Title className="d-flex flex-row align-items-center px-3 pt-3">
        {(searchActive && (
          <SearchBar label={"Search"} searchFunction={meterSearch} />
        )) || <h4 className="bold mb-0">Selected meters</h4>}
        <div className="meter-select-search-button">
          <IconButton
            className="search-button"
            icon={<FaSearch />}
            clickAction={toggleSearch}
          />
        </div>
      </Card.Title>
      <Card.Body className="d-flex flex-column mt-3 px-6">
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
          <h5 className="text-center">No meters selected</h5>
        )}
        {props.selectedMeters.length !== 0 && !searchActive && (
          <div className="meter-select-footer-button mt-auto">
            <IconButton
              icon={<FaTimes />}
              optionalText={"Clear all"}
              clickAction={props.clearSelected}
            />
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

DashboardSelectedMeters.propTypes = {
  selectedMeters: PropTypes.array,
  deselectMeter: PropTypes.func,
  clearSelected: PropTypes.func,
};

export default DashboardSelectedMeters;
