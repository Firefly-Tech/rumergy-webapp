import PropTypes from "prop-types";
import { React, useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { FaSearch, FaTimes } from "react-icons/fa";
import DashboardMeterItem from "./DashboardMeterItem";
import IconButton from "./IconButton";
import SearchBar from "./SearchBar";

function DashboardSelectedMeters(props) {
  const [searchActive, setSearchActive] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  // Refresh search everytime meter list is updated
  useEffect(() => {
    meterSearch();
  }, [props.selectedMeters]);

  const toggleSearch = () => {
    setSearchActive(!searchActive);
    setSearchResults([]);
  };

  const meterSearch = () => {
    setSearchResults(
      searchInput
        ? props.selectedMeters.filter((meter) => {
            return meter.name.toLowerCase().includes(searchInput.toLowerCase());
          })
        : []
    );
  };

  return (
    <Card className="meter-list-card mb-sm-4 flex-fill">
      <Card.Body className="meter-list-card-content d-flex flex-column overflow-auto mt-3 px-6">
        <Card.Title className="d-flex flex-row align-items-center pb-4">
          {(searchActive && (
            <SearchBar
              label={"Search"}
              searchFunction={(input) => {
                setSearchInput(input);
                meterSearch();
              }}
            />
          )) || <h4 className="bold mb-0">Selected meters</h4>}
          <div className="meter-select-search-button">
            <IconButton
              className="search-button"
              icon={<FaSearch />}
              clickAction={toggleSearch}
            />
          </div>
        </Card.Title>
        {props.selectedMeters.length !== 0 ? (
          searchActive ? (
            searchResults.map((meter, index) => {
              return (
                <DashboardMeterItem
                  meter={meter}
                  key={index}
                  clickAction={props.deselectMeter}
                  isAdd={false}
                />
              );
            })
          ) : (
            props.selectedMeters.map((meter, index) => {
              return (
                <DashboardMeterItem
                  meter={meter}
                  key={index}
                  clickAction={props.deselectMeter}
                  isAdd={false}
                />
              );
            })
          )
        ) : (
          <h5 className="text-center my-auto">No meters selected</h5>
        )}
      </Card.Body>
      {props.selectedMeters.length !== 0 && !searchActive && (
        <div className="d-flex flex-row flex-shrink-1 meter-select-footer-button mt-auto mb-3 px-3">
          <IconButton
            icon={<FaTimes />}
            optionalText={"Clear all"}
            clickAction={props.clearSelected}
          />
        </div>
      )}
    </Card>
  );
}

DashboardSelectedMeters.propTypes = {
  selectedMeters: PropTypes.array,
  deselectMeter: PropTypes.func,
  clearSelected: PropTypes.func,
};

export default DashboardSelectedMeters;
