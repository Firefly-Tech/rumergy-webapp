import "./App.scss";
import { BrowserRouter as Router } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import Sidebar from "./components/sidebar.component";

function App() {
  return (
    <Router>
      <Container fluid>
        <Row>
          <Col xs={2} id="sidebar-wrapper">
            <Sidebar />
          </Col>
          <Col xs={10} id="page-content">
            <div>other stuff</div>
          </Col>
        </Row>
      </Container>
    </Router>
  );
}

export default App;
