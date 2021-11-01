import { React, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa";
import {
  Link,
  Route,
  Switch,
  useHistory,
  useRouteMatch,
} from "react-router-dom";
import logo from "../resources/RUMergy-logos_black.png";
import { useAuth } from "../resources/use-auth";
import CreateAccount from "./CreateAccount";
import ErrorModal from "./ErrorModal";
import LoginForm from "./LoginForm";
import axios from "axios";

const apiHost = process.env.REACT_APP_API_HOST;

export default function LoginPages() {
  const [show, setShow] = useState(false);
  const [errorName, setErrorName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const auth = useAuth();
  const history = useHistory();
  const { path } = useRouteMatch();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSignin = async (username, password) => {
    let status = await auth.signin(username, password);
    if (status !== "OK") {
      if (status === "Unauthorized") {
        setErrorName("Invalid credentials");
        setErrorMessage("Provided credentials are invalid.");
      } else {
        setErrorName("Error");
        setErrorMessage("An error occurred. Please try again.");
      }
      return handleShow;
    } else {
      return () => history.push("/");
    }
  };

  const handleLoginSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    let resultAction = await handleSignin(values.username, values.password);
    setSubmitting(false);
    setLoading(false);
    resultAction();
  };

  const handleCreateAccountSubmit = async () => {};
  const userExists = (username, email) => {
    let userByUsername = axios
      .get(`${apiHost}/users?username=${username}`)
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        return [];
      });
    let userByEmail = axios
      .get(`${apiHost}/users?email=${email}`)
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        return [];
      });

    if (!userByUsername.length && !userByEmail.length) return false;

    setErrorName("Error");
    setErrorMessage(
      `A user with the indicated properties already exists:${
        userByUsername.length ? " username" : ""
      }${userByEmail.length ? " email" : ""}`
    );
    handleShow();
    return true;
  };
  // TODO: Add logic for redirecting inactive user to access request (maybe can redirect to dash and provide a new button in nav bar)
  return (
    <>
      <Row className="h-100">
        <Col sm={6} className="flex-fill p-0">
          <div className="logo-container d-flex flex-column">
            <Link
              to="/dashboard"
              className="login-back-button d-flex flex-row gap-2 align-items-center p-3 text-decoration-none fs-5"
            >
              <FaArrowLeft className="" />
              <h5 className="mb-0">Back</h5>
            </Link>
            <img
              src={logo}
              alt="Logo"
              className="login-rumergy-logo img-fluid mx-auto my-auto"
            />
          </div>
        </Col>
        <Col
          sm={6}
          className="d-flex login-form justify-content-center align-items-center"
        >
          <Switch>
            <div className="my-auto flex-fill">
              <Route exact path={path}>
                <LoginForm loading={loading} handleSubmit={handleLoginSubmit} />
              </Route>
              <Route path={`${path}/create-account`}>
                <CreateAccount
                  loading={loading}
                  handleSubmit={handleCreateAccountSubmit}
                  userExists={userExists}
                />
              </Route>
            </div>
          </Switch>
        </Col>
      </Row>
      <ErrorModal
        show={show}
        handleClose={handleClose}
        errorMessage={errorMessage}
        errorName={errorName}
      />
    </>
  );
}
