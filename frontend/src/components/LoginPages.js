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
import AccessPending from "./AccessPending";
import { roles } from "../resources/constants";

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

  // TODO: Change to try catch
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
    }

    if (auth.role === roles.Inactive) {
      let bearer = await auth.withAppUser();
      const getAccessRequestStatus = async (id) => {
        return axios
          .get(`${apiHost}/api/access-request/${id}`, {
            headers: { Authorization: bearer },
          })
          .then((res) => {
            return res.data.status;
          })
          .catch((error) => {
            if (error.response) {
              throw new Error("Unauthorized");
            } else if (error.request) {
              throw new Error("No response");
            } else {
              throw new Error("Unknown error");
            }
          });
      };
      // Check for active access requests
      let accessRequestIds = await axios
        .get(`${apiHost}/api/users/${auth.user.id}`, {
          headers: { Authorization: bearer },
        })
        .then((res) => {
          return res.data.access_request;
        });
      if (!accessRequestIds.length) history.push("/");

      // If active access request redirect to access pending thing
      // If no access request active redirect to new access request
    }
  };

  const handleLoginSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    let resultAction = await handleSignin(values.username, values.password);
    setSubmitting(false);
    setLoading(false);
    resultAction();
  };

  const handleAccessRequestCreation = async (id, occupation, justification) => {
    await axios
      .post(
        `${apiHost}/api/access-request/`,
        {
          user: id,
          occupation: occupation,
          justification: justification,
        },
        { headers: { Authorization: auth.withAppUser() } }
      )
      .catch((error) => {
        if (error.response) {
          throw new Error("Unauthorized");
        } else if (error.request) {
          throw new Error("No response");
        } else {
          throw new Error("Unknown error");
        }
      });
  };

  const handleCreateAccountSubmit = async (values, { setSubmitting }) => {
    setLoading(true);

    try {
      // Create user
      let user = await auth.signup(
        values.username,
        values.password,
        values.email,
        values.firstName,
        values.lastName
      );

      // Create access request
      await handleAccessRequestCreation(
        user.id,
        values.occupation,
        values.justification
      );

      return true;
    } catch (e) {
      setErrorName("Error");
      setErrorMessage("An error occurred, please try again.");
      handleShow();

      return false;
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const userExists = async (username, email) => {
    // Try getting auth for app user
    let bearer;
    try {
      bearer = await auth.withAppUser();
    } catch (e) {
      setErrorName("Error");
      setErrorMessage("An error occurred, please try again.");
      handleShow();

      return true;
    }

    let userByUsername = await axios
      .get(`${apiHost}/api/users?username=${username}`, {
        headers: {
          Authorization: bearer,
        },
      })
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        return [1];
      });
    let userByEmail = await axios
      .get(`${apiHost}/api/users?email=${email}`, {
        headers: { Authorization: bearer },
      })
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        return [1];
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
  // TODO: Add logic for redirecting inactive user with active req to page indicate pending access (maybe make pending access page its own component)
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
              <Route path={`${path}/access-pending`}>
                <AccessPending />
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
