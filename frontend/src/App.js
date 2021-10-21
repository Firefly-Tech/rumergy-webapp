import { React, useState } from "react";
import "./App.scss";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import Sidebar from "./components/Sidebar";
import { roles } from "./resources/constants";
import Dashboard from "./components/Dashboard";

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
      <Container fluid className="overflow-hidden">
        <Row className="vh-100 overflow-auto">
          <Col sm={3} xl={2} className="d-flex flex-column sticky-top px-0 pr-sm-2">
            <Sidebar userRole={userRole} />
          </Col>
          <Col>
            <Route path="/dashboard">
              {(userRole === roles.Admin && (
                <Redirect to="/admin/manage-meters" />
              )) || <Dashboard />}
            </Route>
          </Col>
        </Row>
      </Container>
    </Router>
  );
}

export default App;
