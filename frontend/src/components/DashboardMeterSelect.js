import { React, useState } from "react";
import PropTypes from "prop-types";
import DashboardMeterItem from "./DashboardMeterItem";
import { FaSearch, FaTimes, FaPlus } from "react-icons/fa";
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
        ? props.meterList.filter((meterName) => {
            return meterName.toLowerCase().includes(input.toLowerCase());
          })
        : []
    );
  };

  return (
    <Card className="meter-list-card mb-sm-4 flex-fill">
      <Card.Title className="d-flex flex-row align-items-center px-3 pt-3">
        {(searchActive && (
          <SearchBar label={"Search"} searchFunction={meterSearch} />
        )) || <h4 className="bold mb-0">Available Meters</h4>}
        <div className="meter-select-search-button">
          <IconButton
            className="search-button"
            icon={<FaSearch />}
            clickAction={toggleSearch}
          />
        </div>
      </Card.Title>
      <Card.Body className="meter-list-card-content d-flex flex-column overflow-auto mt-3 px-6">
        {props.meterList.length !== 0 ? (
          searchActive ? (
            searchResults.map((meterName, index) => {
              return (
                <DashboardMeterItem
                  meterName={meterName}
                  key={index}
                  clickAction={props.selectMeter}
                  isAdd={true}
                />
              );
            })
          ) : (
            props.meterList.map((meterName, index) => {
              return (
                <DashboardMeterItem
                  meterName={meterName}
                  key={index}
                  clickAction={props.selectMeter}
                  isAdd={true}
                />
              );
            })
          )
        ) : (
          <h5 className="text-center my-auto">No more meters available</h5>
        )}
      </Card.Body>
      {props.meterList.length !== 0 && !searchActive && (
        <div className="d-flex flex-row flex-shrink-1 meter-select-footer-button mt-auto mb-3 px-3">
          <IconButton
            icon={<FaPlus />}
            optionalText={"Select all"}
            clickAction={props.selectAll}
          />
        </div>
      )}
    </Card>
  );
}

DashboardSelectedMeters.propTypes = {
  meterList: PropTypes.array,
  selectMeter: PropTypes.func,
  selectAll: PropTypes.func,
};

export default DashboardSelectedMeters;
