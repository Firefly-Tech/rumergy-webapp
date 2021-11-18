import PropTypes from "prop-types";
import { React, useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import DashboardMeterItem from "./DashboardMeterItem";
import IconButton from "./IconButton";
import SearchBar from "./SearchBar";

/** Card that lists meters that can be selected on dashboard */
function DashboardMeterSelect(props) {
  const [searchActive, setSearchActive] = useState(false);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    /**
     * Filter meters if either the meter list,
     * filter text, or search status changes.
     *
     * @memberof DashboardMeterSelect
     * */
    meterSearch();
  }, [props.meterList, filterText, searchActive]);

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
      props.meterList.filter((meter) => {
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
              searchFunction={setFilterText}
              filterText={filterText}
            />
          )) || <h4 className="bold mb-0">Available Meters</h4>}
          <div className="meter-select-search-button">
            <IconButton
              className="search-button"
              icon={<FaSearch />}
              clickAction={toggleSearch}
            />
          </div>
        </Card.Title>
        {props.meterList.length !== 0 ? (
          filteredEntries.map((meter, index) => {
            return (
              <DashboardMeterItem
                meter={meter}
                key={index}
                clickAction={props.selectMeter}
                isAdd={true}
              />
            );
          })
        ) : (
          <h5 className="text-center my-auto">No more meters available</h5>
        )}
      </Card.Body>
      <div className="d-flex flex-row flex-shrink-1 meter-select-footer-button mt-auto mb-3 px-3">
        {"Select up to 5 meters"}
      </div>
    </Card>
  );
}

DashboardMeterSelect.propTypes = {
  /** List of meters */
  meterList: PropTypes.array,
  /** Function to select a meter */
  selectMeter: PropTypes.func,
};

export default DashboardMeterSelect;
