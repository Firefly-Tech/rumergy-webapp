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
  FaClipboardList,
  FaClipboardCheck,
  FaSatelliteDish,
  FaList,
  FaUsers,
} from "react-icons/fa";
import { Link, NavLink, useLocation } from "react-router-dom";
import Help from "./Help";

const sidebarData = [
  {
    menuName: "Dashboard",
    link: "/dashboard",
    userRestrictions: [roles.General, roles.Advanced],
    icon: <FaChartLine className="fs-5" />,
  },
  {
    menuName: "About",
    link: "/about",
    userRestrictions: [roles.General, roles.Advanced],
    icon: <FaInfoCircle className="fs-5" />,
  },
  {
    menuName: "Data Logging Scheduler",
    link: "/data-logging-scheduler",
    userRestrictions: [roles.Advanced],
    icon: <FaClipboardList className="fs-5" />,
  },
  {
    menuName: "Data Logs",
    link: "/data-logs",
    userRestrictions: [roles.Advanced],
    icon: <FaClipboardCheck className="fs-5" />,
  },
  {
    menuName: "Real Time Monitor",
    link: "/real-time-monitor",
    userRestrictions: [roles.Advanced],
    icon: <FaSatelliteDish className="fs-5" />,
  },
  {
    menuName: "Meters",
    link: "/meters",
    userRestrictions: [roles.Admin],
    icon: <FaList className="fs-5" />,
  },
  {
    menuName: "Meter Models",
    link: "/meter-models",
    userRestrictions: [roles.Admin],
    icon: <FaList className="fs-5" />,
  },
  {
    menuName: "Users",
    link: "/users",
    userRestrictions: [roles.Admin],
    icon: <FaUsers className="fs-5" />,
  },
  {
    menuName: "Access request",
    link: "/access-request",
    userRestrictions: [roles.Admin],
    icon: <FaUsers className="fs-5" />,
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
    <div className="sidebar d-flex flex-sm-column flex-grow-1 align-items-sm-stretch align-items-center">
      {/* Header */}
      <div className="d-flex flex-row justify-content-center align-items-center text-white p-sm-3 px-3 gap-2">
        <FaBolt className="fs-5" />
        <h2 className="bold mb-0 d-none d-sm-inline">RUMergy</h2>
      </div>
      {/* Nav */}
      <Nav
        className=" flex-sm-column flex-row flex-nowrap flex-shrink-1 flex-sm-grow-0 flex-grow-1 mb-sm-auto mb-0 justify-content-center align-items-center align-items-sm-stretch"
        activeKey={location.pathname}
      >
        {sidebarData.map((item, index) => {
          return (
            checkRestrictions(item.userRestrictions) && (
              <Nav.Item className="sidebar-item" key={index}>
                <Nav.Link
                  as={NavLink}
                  to={item.link}
                  className="d-flex gap-2 align-items-center"
                >
                  {item.icon}
                  <span className="ms-1 d-none d-sm-inline">
                    {item.menuName}
                  </span>
                </Nav.Link>
              </Nav.Item>
            )
          );
        })}
      </Nav>
      {/* Footer */}
      <div className="sidebar-footer d-flex flex-sm-row flex-column align-items-center mt-sm-auto p-sm-3 px-3 gap-sm-0 gap-3">
        <Link
          className="d-flex align-items-center text-decoration-none me-sm-auto gap-2"
          to={isLoggedIn() ? "/logout" : "/login"}
        >
          {isLoggedIn() ? (
            <FaSignOutAlt className="fs-5" />
          ) : (
            <FaSignInAlt className="fs-5" />
          )}
          <span className="d-none d-sm-inline">
            {isLoggedIn() ? "Logout" : "Login"}
          </span>
        </Link>
        <Help />
      </div>
    </div>
  );
}

Sidebar.propTypes = {
  userRole: PropTypes.string,
};

export default Sidebar;
