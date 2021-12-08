import { React } from "react";
import "./App.scss";
import { Route, Redirect, Switch } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
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
import ManageBuildings from "./components/ManageBuildings";

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
              {(auth.role === roles.Admin && (
                <Redirect to="/admin/manage-meters" />
              )) || <DLSFormikWrapper />}
              {/* <DataLoggingScheduler/> */}
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
            <Route path="/admin/manage-buildings">
              <ManageBuildings />
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
  );
}

export default App;
