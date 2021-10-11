import React from "react";
import "./App.scss";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import Sidebar from "./components/sidebar.component";

function App() {
  return (
      <Router>
        <Container fluid className="main-container">
          <Row>
            <Col xs={2} className="sidebar-wrapper">
              <Sidebar userRole="GEN" />
            </Col>
            <Col xs={10} id="page-content">
              <Route path="/dashboard"><span>Dashboard</span></Route>
            </Col>
          </Row>
        </Container>
      </Router>
  );
}

export default App;
