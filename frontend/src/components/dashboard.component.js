import React from "react";
import PropTypes from "prop-types";
import { Col, Row } from "react-bootstrap";

function Dashboard(props) {
  return (
    <div className="dashboard-container">
      <Row>
        <Col xs={12}>
          <div className="section-header">
            <h1>Dashboard</h1>
          </div>
        </Col>
      </Row>
      <Row>
        <Col xs={3}>
          <div className="content-card">
          
          </div>
        </Col>
      </Row>
    </div>
  );
}

Dashboard.propTypes = {};

export default Dashboard;
