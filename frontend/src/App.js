import { React, useState } from "react";
import "./App.scss";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import Sidebar from "./components/Sidebar";
import { roles } from "./resources/constants";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";

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
        <Row className="vh-100 overflow-hidden">
          <Col
            sm={3}
            xl={2}
            className="d-flex flex-column sticky-top px-0 pr-sm-2"
          >
            <Route path={/^(?!.*login).*$/}>
              <Sidebar userRole={userRole} />
            </Route>
          </Col>
          <Col className="pt-4 pt-sm-0">
            <Switch>
              <Route path="/dashboard">
                {(userRole === roles.Admin && (
                  <Redirect to="/admin/manage-meters" />
                )) || <Dashboard />}
              </Route>
              <Route path="/login">
                <Login />
              </Route>
            </Switch>
          </Col>
        </Row>
      </Container>
    </Router>
  );
}

export default App;
