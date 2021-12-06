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
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Nisl
                condimentum id venenatis a. Pellentesque eu tincidunt tortor
                aliquam nulla facilisi cras fermentum. Purus sit amet luctus
                venenatis. Ac odio tempor orci dapibus ultrices in iaculis nunc
                sed. Amet consectetur adipiscing elit duis. Aenean sed
                adipiscing diam donec adipiscing tristique risus nec.
                Suspendisse sed nisi lacus sed viverra tellus in. Vestibulum
                morbi blandit cursus risus. Tellus orci ac auctor augue mauris
                augue neque gravida in. Sit amet nulla facilisi morbi tempus
                iaculis urna id volutpat. Risus nullam eget felis eget nunc
                lobortis mattis. Ut faucibus pulvinar elementum integer enim
                neque volutpat ac tincidunt.
              </p>{" "}
              <p
                className="text-wrap"
                style={{ "font-size": "1.2rem", width: "60vw" }}
              >
                Sit amet tellus cras adipiscing enim eu. Arcu felis bibendum ut
                tristique. Dui vivamus arcu felis bibendum ut tristique et
                egestas. Et malesuada fames ac turpis egestas sed tempus urna
                et. Vitae suscipit tellus mauris a. Malesuada pellentesque elit
                eget gravida cum sociis natoque. Facilisis gravida neque
                convallis a cras semper auctor neque vitae. Amet mauris commodo
                quis imperdiet massa tincidunt. Sed enim ut sem viverra aliquet
                eget sit amet. Mi in nulla posuere sollicitudin aliquam
                ultrices. Ipsum suspendisse ultrices gravida dictum fusce. Lacus
                sed turpis tincidunt id. Tortor pretium viverra suspendisse
                potenti nullam ac tortor vitae. Nulla facilisi cras fermentum
                odio. Nisl tincidunt eget nullam non nisi est sit amet. Maecenas
                sed enim ut sem viverra aliquet eget sit. Adipiscing diam donec
                adipiscing tristique risus nec feugiat in. A erat nam at lectus.
                At consectetur lorem donec massa.
              </p>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
}

export default About;
