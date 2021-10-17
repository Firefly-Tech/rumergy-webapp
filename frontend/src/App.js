import { React, useState } from "react";
import "./App.scss";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import Sidebar from "./components/Sidebar";
import { roles } from "./resources/constants";
import Dashboard from "./components/Dashboard";

// TODO: Fix content going under sidebar
function App() {
  const [userRole, setUserRole] = useState(roles.General);

  const rootRedirect = (role) => {
    return (
      ((userRole === roles.General || userRole === roles.Advanced) &&
        "/dashboard") ||
      "/admin/manage-meters"
    );
  };

  return (
    <Router>
      <Route path="/" exact>
        <Redirect to={rootRedirect(userRole)} />
      </Route>
      <Container fluid className="main-container">
        <Row>
          <Col sm={2} className="">
            <Sidebar userRole="GEN" />
          </Col>
          <Col offset={2} id="page-content">
            <Route path="/dashboard">
              <Dashboard />
            </Route>
          </Col>
        </Row>
      </Container>
    </Router>
  );
}

export default App;
