import React from "react";
import PropTypes from "prop-types";
import { Nav } from "react-bootstrap";

function SidebarItem(props) {
  return (
      <Nav.Item className="sidebar-item">
        <Nav.Link href={props.link}>
            {props.icon}
            <h3>{props.menuName}</h3>
        </Nav.Link>
      </Nav.Item>
  );
}

SidebarItem.propTypes = {
  menuName: PropTypes.string,
  link: PropTypes.string,
  icon: PropTypes.object,
};

export default SidebarItem;
