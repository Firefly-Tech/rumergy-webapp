import PropTypes from "prop-types";
import { React, useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { FaSearch, FaTimes } from "react-icons/fa";
import DashboardMeterItem from "./DashboardMeterItem";
import IconButton from "./IconButton";
import SearchBar from "./SearchBar";

/** Card that lists selected meters on dashboard */
function DashboardSelectedMeters(props) {
  const [searchActive, setSearchActive] = useState(false);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    /**
     * Filter meters if either the meter list,
     * filter text, or search status changes.
     *
     * @memberof DashboardSelectedMeters
     * */
    meterSearch();
  }, [props.selectedMeters, filterText, searchActive]);

  /**
   * Toggles the search bar.
   *
   * @function toggleSearch
   * */
  const toggleSearch = () => {
    setSearchActive(!searchActive);
    setFilterText("");
    setFilteredEntries([]);
  };

  /**
   * Meter filtering handler.
   *
   * @function meterSearch
   * */
  const meterSearch = () => {
    setFilteredEntries(
      props.selectedMeters.filter((meter) => {
        return meter.name.toLowerCase().includes(filterText.toLowerCase());
      })
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
                setFilterText(input);
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
          filteredEntries.map((meter, index) => {
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
  /** List of selected meters */
  selectedMeters: PropTypes.array,
  /** Function to deselect a meter */
  deselectMeter: PropTypes.func,
  /** Function to clear all selected meters */
  clearSelected: PropTypes.func,
};

export default DashboardSelectedMeters;
