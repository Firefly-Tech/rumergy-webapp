import React from "react";
import "./App.scss";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import Sidebar from "./components/sidebar.component";

function App() {
  return (
    <Router>
      <Sidebar userRole="GEN" />
      <Route path="/" exact>
        <Redirect to="/dashboard" />
      </Route>
      <Container fluid className="main-container">
        <Row>
          <Col xs={10} id="page-content">
            <Route path="/dashboard">
              <span>Dashboard</span>
            </Route>
          </Col>
        </Row>
      </Container>
    </Router>
  );
}

export default App;
