import React from "react";
import PropTypes from "prop-types";

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
  icon: PropTypes.object,
  optionalText: PropTypes.string,
  clickAction: PropTypes.func,
};

export default IconButton;
