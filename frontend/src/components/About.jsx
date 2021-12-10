import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import logo from "../resources/RUMergy-logos_black.png";

function About() {
  return (
    <>
      <Row>
        <Col className="d-flex flex-column px-4 pt-4">
          <Row>
            <Col sm={12} className="d-flex flex-row pb-4">
              <h1 className="bold mb-0">About RUMergy</h1>
            </Col>
          </Row>
          <Row>
            <Col>
              <p
                className="text-wrap"
                style={{ "font-size": "1.2rem", width: "60vw" }}
              >
                RUMergy is a web application that allows access to energy
                consumption data collected by electronic meters installed on
                campus in the University of Puerto Rico at Mayaguez. It was
                created by the Firefly Tech composed by students from the
                Electrical & Computer Engineering Department as part of the
                Capstone course.
              </p>{" "}
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
}

export default About;
