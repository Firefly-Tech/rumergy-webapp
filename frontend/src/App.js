import { React, useState } from "react";
import "./App.scss";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import Sidebar from "./components/Sidebar";
import { roles } from "./resources/constants";
import Dashboard from "./components/Dashboard";
import DataLoggingScheduler from "./components/DataLoggingScheduler";

function App() {
  const [userRole, setUserRole] = useState(roles.Advanced);
  //Remember to change this to roles.General before push
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
      <Container fluid className="overflow-hidden">
        <Row className="vh-100 overflow-auto">
          <Col sm={3} xl={2} className="d-flex flex-column sticky-top px-0 pr-sm-2">
            <Sidebar userRole={userRole} />
          </Col>
          <Col className="pt-4 pt-sm-0">
            <Route path="/dashboard">
              {(userRole === roles.Admin && (
                <Redirect to="/admin/manage-meters" />
              )) || <Dashboard />}
            </Route>
            <Route path = "/data-logging-scheduler">
            {(userRole === roles.Admin && (
                <Redirect to="/admin/manage-meters" />
              )) || <DataLoggingScheduler />}
            </Route>  
          </Col>
        </Row>
      </Container>
    </Router>
  );
}

export default App;
