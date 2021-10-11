import PropTypes from "prop-types";
import React from "react";
import { Nav } from "react-bootstrap";
import SidebarItem from "./sidebarItem.component";
import { roles } from "../resources/constants";
import { FaChartLine, FaBolt } from "react-icons/fa";

const sidebarData = [
  {
    menuName: "Dashboard",
    link: "/dashboard",
    userRestrictions: [roles.General, roles.Advanced],
    icon: <FaChartLine />,
  },
  {
    menuName: "Dashboard",
    link: "/dashboard",
    userRestrictions: [roles.General, roles.Advanced],
    icon: <FaChartLine />,
  },
];

function Sidebar(props) {
  const checkRestrictions = (restrictions) => {
    return restrictions.includes(props.userRole);
  };

  return (
    <div className="sidebar flex-column">
      <div className="sidebar-header">
        <FaBolt />
        <h2>RUMergy</h2>
      </div>
      <Nav className="flex-column nav-container">
        {sidebarData.map((item, index) => {
          return (
            checkRestrictions(item.userRestrictions) && (
              <SidebarItem
                menuName={item.menuName}
                link={item.link}
                icon={item.icon}
                key={index}
              />
            )
          );
        })}
      </Nav>
    </div>
  );
}

Sidebar.propTypes = {
  userRole: PropTypes.string,
};

export default Sidebar;
