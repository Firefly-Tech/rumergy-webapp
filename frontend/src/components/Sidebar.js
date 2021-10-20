import PropTypes from "prop-types";
import React from "react";
import { Nav } from "react-bootstrap";
import { roles } from "../resources/constants";
import {
  FaChartLine,
  FaBolt,
  FaInfoCircle,
  FaSignInAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { Link, NavLink, useLocation } from "react-router-dom";
import Help from "./Help";

const sidebarData = [
  {
    menuName: "Dashboard",
    link: "/dashboard",
    userRestrictions: [roles.General, roles.Advanced],
    icon: <FaChartLine />,
  },
  {
    menuName: "About",
    link: "/about",
    userRestrictions: [roles.General, roles.Advanced],
    icon: <FaInfoCircle />,
  },
];

function Sidebar(props) {
  const location = useLocation();

  const checkRestrictions = (restrictions) => {
    return restrictions.includes(props.userRole);
  };

  const isLoggedIn = () => {
    return props.userRole !== roles.General;
  };

  return (
    <div className="sidebar d-flex flex-sm-column flex-row flex-grow-1 align-items-center align-items-sm-start px-3 pt-2">
      {/* Header */}
      <div className="d-flex justify-content-center align-items-center text-white p-xl-3 gap-2">
        <div className="header-logo">
          <FaBolt />
        </div>
        <h2 className="bold mb-0">RUMergy</h2>
      </div>
      {/* Nav */}
      <Nav
        variant="pills"
        className="flex-column nav-fill"
        activeKey={location.pathname}
      >
        {sidebarData.map((item, index) => {
          return (
            checkRestrictions(item.userRestrictions) && (
              <Nav.Item className="sidebar-item" key={index}>
                <Nav.Link as={NavLink} to={item.link}>
                  {item.icon}
                  <span id="sidebar-menu-span">{item.menuName}</span>
                </Nav.Link>
              </Nav.Item>
            )
          );
        })}
      </Nav>
      {/* Footer */}
      <div className="d-flex flex-row align-items-center mt-sm-auto mt-xl-auto">
        <div className="sidebar-login-logout">
          <Link to={isLoggedIn() ? "/logout" : "/login"}>
            {isLoggedIn() ? <FaSignOutAlt /> : <FaSignInAlt />}
            <span>{isLoggedIn() ? "Logout" : "Login"}</span>
          </Link>
        </div>
        <div className="sidebar-help ml-xl-auto">
          <Help />
        </div>
      </div>
    </div>
  );
}

Sidebar.propTypes = {
  userRole: PropTypes.string,
};

export default Sidebar;
