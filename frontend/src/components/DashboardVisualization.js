import React from "react";
import { Card } from "react-bootstrap";

function DashboardVisualization(props) {
  return (
    <Card className="dashboard-data-visualization-card mb-sm-4 flex-fill">
      <Card.Body>
        <Card.Title className="px-3 pt-3">
          <h4 className="bold">Data Visualization</h4>
        </Card.Title>
      </Card.Body>
    </Card>
  );
}

export default DashboardVisualization;
