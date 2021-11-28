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
import RepeatAccessRequest from "./RepeatAccessRequest";
import ForgotPassword from "./ForgotPassword";
import PasswordReset from "./PasswordReset";

/**
 * Wrapper component that handles state in
 * all of the pages in the login section.
 *
 * Includes: Create account, forgot password,
 * and password reset.
 * */
export default function LoginPages() {
  const [show, setShow] = useState(false);
  const [errorName, setErrorName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const auth = useAuth();
  const history = useHistory();
  const { path } = useRouteMatch();

  /**
   * Handles hiding the error modal.
   *
   * @function handleClose
   * */
  const handleClose = () => setShow(false);

  /**
   * Handles showing the error modal.
   *
   * @function handleClose
   * */
  const handleShow = () => setShow(true);

  /**
   * Handles user login request.
   *
   * @function handleSignin
   * @param {string} username
   * @param {string} password
   * @returns {function} Resulting action
   * @async
   * */
  const handleSignin = async (username, password) => {
    let userObject;
    try {
      userObject = await auth.signin(username, password);
    } catch (error) {
      setErrorName(
        error.response.status === 401 ? "Invalid credentials" : "Error"
      );
      setErrorMessage(
        error.response.status === 401
          ? "Provided credentials are invalid."
          : "An error occurred. Please try again."
      );
      return handleShow;
    }

    // Logic for inactive users
    if (userObject.role === roles.Inactive) {
      let bearer = await auth.withAppUser();

      // Get status of latest access request
      try {
        const accessRequestStatus = await axios
          .get(
            `${auth.apiHost}/api/users/${userObject.id}/latest_access_request`,
            {
              headers: { Authorization: bearer },
            }
          )
          .then((res) => {
            if (!res.data) return null;
            return res.data.status;
          })
          .catch((error) => {
            throw error;
          });

        // If no active request or no requests at all
        if (accessRequestStatus !== "ACT" || !accessRequestStatus) {
          // Redirect to page to request access
          return () => history.push(`${path}/send-access-request`);
        } else {
          // Redirect to pending access page
          return () => history.push(`${path}/access-pending`);
        }
      } catch (error) {
        auth.signout();
        setErrorName("Error");
        setErrorMessage("An error occurred. Please try again.");
        return handleShow;
      }
    } else {
      return () => history.push("/");
    }
  };

  /**
   * Handles the submit of the login form.
   *
   * @function handleLoginSubmit
   * @param {object} values - Formik object with form values
   * @param {function} setSubmitting - Formik function to handle submitting state
   * @async
   * */
  const handleLoginSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    let resultAction = await handleSignin(values.username, values.password);
    setSubmitting(false);
    setLoading(false);
    resultAction();
  };

  /**
   * Handles access request creation.
   *
   * @function handleAccessRequestCreation
   * @param {number} id - User id related to access request
   * @param {string} occupation - Occupation description
   * @param {string} justification - Justification for access request
   * @async
   * */
  const handleAccessRequestCreation = async (id, occupation, justification) => {
    await axios
      .post(
        `${auth.apiHost}/api/access-request/`,
        {
          user: id,
          occupation: occupation,
          justification: justification,
        },
        { headers: { Authorization: await auth.withAppUser() } }
      )
      .catch((error) => {
        throw error;
      });
  };

  /**
   * Handles submission of a repeat access request form.
   *
   * @function handleRepeatAccessRequest
   * @param {object} values - Formik object with form values
   * @param {function} setSubmitting - Formik function to handle submitting state
   * @returns {boolean} True if successful
   * @async
   * */
  const handleRepeatAccessRequest = async (values, { setSubmitting }) => {
    setLoading(true);

    try {
      // Create access request
      await handleAccessRequestCreation(
        auth.user.id,
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

  /**
   * Handles submission of account creation form.
   *
   * @function handleCreateAccountSubmit
   * @param {object} values - Formik object with form values
   * @param {function} setSubmitting - Formik function to handle submitting state
   * @returns {boolean} True if successful
   * @async
   * */
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

  /**
   * Helper function to determine if a user
   * with the provided username and/or password
   * already exists in the system.
   *
   * @function userExists
   * @param {string} username
   * @param {string} email
   * @async
   * */
  const userExists = async (username, email) => {
    setLoading(true);
    // Try getting auth for app user
    let bearer;
    try {
      bearer = await auth.withAppUser();
    } catch (e) {
      setErrorName("Error");
      setErrorMessage("An error occurred, please try again.");
      handleShow();
      setLoading(false);

      return true;
    }

    // Get user by their username
    let userByUsername = await axios
      .get(`${auth.apiHost}/api/users?username=${username}`, {
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

    // Get user by their email
    let userByEmail = await axios
      .get(`${auth.apiHost}/api/users?email=${email}`, {
        headers: { Authorization: bearer },
      })
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        return [1];
      });

    if (!userByUsername.length && !userByEmail.length) {
      setLoading(false);
      return false;
    }

    setErrorName("Error");
    setErrorMessage(
      `A user with the indicated properties already exists:${
        userByUsername.length ? " username" : ""
      }${userByEmail.length ? " email" : ""}`
    );
    handleShow();
    setLoading(false);
    return true;
  };

  /**
   * Handles submission of forgot password form.
   *
   * @function handleForgotPasswordSubmit
   * @param {object} values - Formik object with form values
   * @param {function} setSubmitting - Formik function to handle submitting state
   * @returns {boolean} True if successful
   * @async
   * */
  const handleForgotPasswordSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    try {
      await auth.sendPasswordResetEmail(values.email);
    } catch (error) {
      if (error.response.status !== 400) {
        setErrorName("Error");
        setErrorMessage("An error occurred. Please try again.");
        handleShow();

        return false;
      }
    } finally {
      setSubmitting(false);
      setLoading(false);
    }

    return true;
  };

  /**
   * Handles submission of password reset form.
   *
   * @function handlePasswordResetSubmit
   * @param {string} token - Password reset token
   * @param {string} values - Formik object with form values
   * @param {function} setSubmitting - Formik function to handle submitting state
   * @returns {boolean} True if successful
   * @async
   * */
  const handlePasswordResetSubmit = async (
    token,
    values,
    { setSubmitting }
  ) => {
    setLoading(true);
    try {
      await auth.confirmPasswordReset(token, values.password);
    } catch (error) {
      setErrorName("Error");
      setErrorMessage("An error occurred. Please try again.");
      handleShow();

      return false;
    } finally {
      setSubmitting(false);
      setLoading(false);
    }

    return true;
  };

  /**
   * Verifies if password reset token is valid.
   *
   * @function  verifyToken
   * @param {string} token - Password reset token
   * @returns {string} Password reset token if successful, otherwise null
   * @async
   * */
  const verifyToken = async (token) => {
    setLoading(true);
    return axios
      .post(`${auth.apiHost}/api/password_reset/validate_token/`, {
        token: token,
      })
      .then(() => {
        return token;
      })
      .catch(() => {
        return null;
      })
      .finally(() => {
        setLoading(false);
      });
  };

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
            <>
              <div className="my-auto flex-fill">
                <Route exact path={path}>
                  <LoginForm
                    loading={loading}
                    handleSubmit={handleLoginSubmit}
                  />
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
                <Route path={`${path}/send-access-request`}>
                  <RepeatAccessRequest
                    loading={loading}
                    handleSubmit={handleRepeatAccessRequest}
                  />
                </Route>
                <Route path={`${path}/forgot-password`}>
                  <ForgotPassword
                    handleSubmit={handleForgotPasswordSubmit}
                    loading={loading}
                  />
                </Route>
                <Route path={`${path}/password-reset`}>
                  <PasswordReset
                    loading={loading}
                    handleSubmit={handlePasswordResetSubmit}
                    verifyToken={verifyToken}
                  />
                </Route>
              </div>
            </>
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
