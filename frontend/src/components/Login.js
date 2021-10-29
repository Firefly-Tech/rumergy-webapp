import React from "react";
import { Row, Col, Form, Button } from "react-bootstrap";

export default function Login() {
  return (
    <Row className="h-100">
      <Col sm={6} className="flex-fill p-0">
        <div className="logo-container"></div>
      </Col>
      <Col
        sm={6}
        className="d-flex login-form justify-content-center align-items-center"
      >
        <div className="my-auto flex-fill">
          <h2 className="bold mb-4">Member Login</h2>
          <Form className="d-flex flex-column flex-fill">
            <Form.Group className="mb-3" controlId="formGroupEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" />
            </Form.Group>
            <Button variant="primary" type="submit">
              Login
            </Button>
          </Form>
        </div>
      </Col>
    </Row>
  );
}
