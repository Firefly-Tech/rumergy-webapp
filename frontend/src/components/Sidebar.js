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
  FaEnvelopeOpen,
  FaBars,
  FaWifi,
  FaBuilding,
} from "react-icons/fa";
import { NavLink, useLocation, useHistory } from "react-router-dom";
import Help from "./Help";
import { useAuth } from "../resources/use-auth";
import IconButton from "./IconButton";

/**
 * Links to be shown in sidebar.
 * Each has a list of roles that can view said link
 * and will determine if its shown on the sidebar.
 *
 * @const sidebarData
 * */
const sidebarData = [
  {
    menuName: "Dashboard",
    link: "/dashboard",
    userRestrictions: [roles.General, roles.Advanced, roles.Inactive],
    icon: <FaChartLine className="fs-5" />,
  },
  {
    menuName: "About",
    link: "/about",
    userRestrictions: [roles.General, roles.Advanced, roles.Inactive],
    icon: <FaInfoCircle className="fs-5" />,
  },
  {
    menuName: "Data Logging Scheduler",
    link: "/advanced/data-logging-scheduler",
    userRestrictions: [roles.Advanced],
    icon: <FaClipboardList className="fs-5" />,
  },
  {
    menuName: "Data Logs",
    link: "/advanced/data-logs",
    userRestrictions: [roles.Advanced],
    icon: <FaClipboardCheck className="fs-5" />,
  },
  {
    menuName: "Real Time Monitor",
    link: "/advanced/real-time-monitor",
    userRestrictions: [roles.Advanced],
    icon: <FaSatelliteDish className="fs-5" />,
  },
  {
    menuName: "Meters",
    link: "/admin/manage-meters",
    userRestrictions: [roles.Admin],
    icon: <FaList className="fs-5" />,
  },
  {
    menuName: "Users",
    link: "/admin/manage-users",
    userRestrictions: [roles.Admin],
    icon: <FaUsers className="fs-5" />,
  },
  {
    menuName: "Access Requests",
    link: "/admin/manage-access-requests",
    userRestrictions: [roles.Admin],
    icon: <FaEnvelopeOpen className="fs-5" />,
  },
  {
    menuName: "Buildings",
    link: "/admin/manage-buildings",
    userRestrictions: [roles.Admin],
    icon: <FaBuilding className="fs-5" />,
  },
  {
    menuName: "Meter Models",
    link: "/admin/manage-meter-models",
    userRestrictions: [roles.Admin],
    icon: <FaBars className="fs-5" />,
  },
  {
    menuName: "Real Time Monitor",
    link: "/advanced/real-time-monitor",
    userRestrictions: [roles.Advanced],
    icon: <FaWifi className="fs-5" />,
  },
];

/** Navigation sidebar */
function Sidebar() {
  const location = useLocation();
  const auth = useAuth();
  const history = useHistory();

  /**
   * Checks if current user role is included
   * in the link's permission list.
   *
   * @function checkRestrictions
   * @param {array} restrictions - List of roles
   * @returns {boolean}
   * */
  const checkRestrictions = (restrictions) => {
    return restrictions.includes(auth.role);
  };

  /**
   * Determines if current user is logged in.
   *
   *@function isLoggedIn
   *@returns {boolean}
   * */
  const isLoggedIn = () => {
    return auth.user !== false;
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
      <div className="d-flex flex-column flex-sm-row align-items-center mt-sm-auto p-sm-3 px-3 gap-sm-0 gap-3 fs-6">
        <div className="me-sm-auto">
          <IconButton
            icon={isLoggedIn() ? <FaSignOutAlt /> : <FaSignInAlt />}
            optionalText={isLoggedIn() ? "Logout" : "Login"}
            clickAction={
              isLoggedIn()
                ? () => {
                    auth.signout();
                    history.push("/");
                  }
                : () => history.push("/login")
            }
          />
        </div>
        <Help />
      </div>
    </div>
  );
}

export default Sidebar;
