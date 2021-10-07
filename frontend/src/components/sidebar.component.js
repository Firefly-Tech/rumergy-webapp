import React from "react";
import "./sidebar.scss"
import { Nav } from "react-bootstrap";

function Sidebar() {
  return (
    <Nav className="sidebar d-none d-md-block flex-column">
      <Nav.Item>
        <Nav.Link href="/">Test</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="/">Test</Nav.Link>
      </Nav.Item>
    </Nav>
  );
}

export default Sidebar;
