import React from "react"
import PropTypes from "prop-types"


function IconButton(props) {
    return (
        <button className="icon-button" onClick={props.clickAction}>
            {props.icon}
        </button>
    )
}

IconButton.propTypes = {
    icon: PropTypes.object,
    clickAction: PropTypes.func
}

export default IconButton;