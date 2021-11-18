import React from "react";
import PropTypes from "prop-types";

/** Component to display icon as a button */
function IconButton(props) {
  return (
    <button className="icon-button" onClick={props.clickAction}>
      {props.icon}
      {props.optionalText && (
        <span className="d-none d-sm-block">{props.optionalText}</span>
      )}
    </button>
  );
}

IconButton.propTypes = {
  /** Icon to be used as button (react icon) */
  icon: PropTypes.object,
  /** Button text */
  optionalText: PropTypes.string,
  clickAction: PropTypes.func,
};

export default IconButton;
