import { React } from "react";
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
import LoginPages from "./components/LoginPages";
import { useAuth } from "./resources/use-auth";

const includeSidebar = ["/dashboard*", "/admin*", "/advanced*", "/about*"];

function App() {
  const auth = useAuth();

  // TODO: Add redirect for INA user
  const rootRedirect = () => {
    return (
      ((auth.role === roles.General || auth.role === roles.Advanced) &&
        "/dashboard") ||
      "/admin/manage-meters"
    );
  };

  return (
    <Router>
      <Container fluid className="overflow-hidden">
        <Row className="vh-100 overflow-hidden">
          <Route path={includeSidebar}>
            <Col
              sm={3}
              xl={2}
              className="d-flex flex-column sticky-top px-0 pr-sm-2"
            >
              <Sidebar />
            </Col>
          </Route>
          <Col className="pt-sm-0">
            <Switch>
              <Route path="/dashboard">
                {(auth.role === roles.Admin && (
                  <Redirect to="/admin/manage-meters" />
                )) || <Dashboard />}
              </Route>
              <Route path="/login">
                <LoginPages />
              </Route>
              <Route path="/" exact>
                <Redirect to={rootRedirect()} />
              </Route>
              {/* TODO: Add 404 page */}
              <Route path="*">
                <h3>Page not found</h3>
              </Route>
            </Switch>
          </Col>
        </Row>
      </Container>
    </Router>
  );
}

export default App;
