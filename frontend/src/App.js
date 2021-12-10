import { React } from "react";
import "./App.scss";
import { Route, Redirect, Switch, useHistory } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import Sidebar from "./components/Sidebar";
import { roles } from "./resources/constants";
import Dashboard from "./components/Dashboard";
import LoginPages from "./components/LoginPages";
import { useAuth } from "./resources/use-auth";
import DLSFormikWrapper from "./components/DataLoggingScheduler";
import DataLogs from "./components/DataLogs";
import ManageMeter from "./components/ManageMeter";
import ManageUsers from "./components/ManageUsers";
import ManageAccessRequests from "./components/ManageAccessRequests";
import ManageMeterModels from "./components/ManageMeterModels";
import RealTimeMonitor from "./components/RealTimeMonitor";
import ManageBuildings from "./components/ManageBuildings";
import About from "./components/About";

const includeSidebar = ["/dashboard*", "/admin*", "/advanced*", "/about*"];

/** Main app component */
function App() {
  const auth = useAuth();

  /**
   * Determinres redirect link
   * depending on user role.
   *
   * @function rootRedirect
   * @returns {string} Redirect link
   * */
  const rootRedirect = () => {
    return (
      ((auth.role === roles.General ||
        auth.role === roles.Advanced ||
        auth.role === roles.Inactive ||
        !auth.role) &&
        "/dashboard") ||
      "/admin/manage-meters"
    );
  };

  const history = useHistory();

  return (
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
            <Route path="/advanced/data-logging-scheduler">
              <DLSFormikWrapper />
            </Route>
            <Route path="/advanced/data-logs">
              {/* <DataLogs/>  */}
              <DataLogs />
            </Route>
            <Route path="/admin/manage-meters">
              <ManageMeter />
            </Route>
            <Route path="/admin/manage-users">
              <ManageUsers />
            </Route>
            <Route path="/admin/manage-access-requests">
              <ManageAccessRequests />
            </Route>
            <Route path="/admin/manage-meter-models">
              <ManageMeterModels />
            </Route>
            <Route path="/advanced/real-time-monitor">
              <RealTimeMonitor />
            </Route>
            <Route path="/admin/manage-buildings">
              <ManageBuildings />
            </Route>
            <Route path="/about">
              <About />
            </Route>
            <Route path="/" exact>
              <Redirect to={rootRedirect()} />
            </Route>
            <Route path="*">
              <Row className="h-100">
                <Col className="d-flex flex-column">
                  <div className="d-flex flex-column align-items-center my-auto mx-auto gap-2">
                    <h2 className="bold">Oops!</h2>
                    <h4>The page you requested was not found.</h4>
                    <Button
                      variant="primary"
                      onClick={() => {
                        history.push("/");
                      }}
                    >
                      Home
                    </Button>
                  </div>
                </Col>
              </Row>
            </Route>
          </Switch>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
