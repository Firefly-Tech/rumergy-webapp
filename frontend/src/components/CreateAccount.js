import { Formik } from "formik";
import PropTypes from "prop-types";
import { React, useState } from "react";
import { useHistory } from "react-router";
import { Col, Row, Spinner, Form, InputGroup, Button } from "react-bootstrap";
import * as Yup from "yup";

// Schema in array form to support multiple steps
const createAccountFormSchema = [
  Yup.object().shape({
    firstName: Yup.string()
      .min(1, "Must be at least 1 character")
      .max(50, "Must be at most 50 characters")
      .required("First name is required")
      .matches(/\b([A-ZÀ-ÿ][-,a-z. ']+[ ]*)+/, "Invalid format"),
    lastName: Yup.string()
      .min(1, "Must be at least 1 character")
      .max(50, "Must be at most 50 characters")
      .required("Last name is required")
      .matches(/\b([A-ZÀ-ÿ][-,a-z. ']+[ ]*)+/, "Invalid format"),
    username: Yup.string()
      .min(4, "Must be at least 4 characters")
      .max(20, "Must be less than 20 characters")
      .required("Username required")
      .matches(/^[a-zA-Z0-9]+([._]?[a-zA-Z0-9]+)*$/, "Invalid username format"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email required"),
    password: Yup.string()
      .min(8, "Must be at least 8 characters")
      .max(20, "Must be at most 20 characters long")
      .required("Password required")
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]/,
        "Password does not meet requirements"
      ),
    passwordConfirmation: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Password confirmation required"),
  }),
  Yup.object().shape({
    occupation: Yup.string()
      .required("Occupation required")
      .matches(/^[a-zA-Z]+$/, "Invalid format")
      .max(50, "Must be at most 50 characters."),
    justification: Yup.string()
      .required("Justification required")
      .max(200, "Must be at most 200 characters."),
  }),
];

export default function CreateAccount(props) {
  const [step, setStep] = useState(0);
  const [success, setSuccess] = useState(false);

  const history = useHistory();

  const incrementStep = () => {
    setStep(step + 1);
  };
  const decrementStep = () => {
    setStep(step - 1);
  };

  const renderStep = (formik) => {
    switch (step) {
      case 0:
        return <StepOne formik={formik} />;
      case 1:
        return <StepTwo formik={formik} decrementStep={decrementStep} />;
    }
  };

  if (success) {
    history.push("/login/access-pending");
  }

  return (
    <>
      <Row className="mb-4">
        <Row className="mb-2">
          <Col className="d-flex flex-row align-items-center gap-4">
            <h2 className="bold mb-0">Access Request</h2>
            {props.loading && (
              <Spinner animation="border" variant="secondary" />
            )}
          </Col>
        </Row>
        <Row>
          <Col className>
            <span className="text-muted">
              {"Request access to the site's advanced features"}
            </span>
          </Col>
        </Row>
      </Row>
      <Row>
        <Col>
          <Formik
            initialValues={{
              firstName: "",
              lastName: "",
              username: "",
              email: "",
              password: "",
              passwordConfirmation: "",
              occupation: "",
              justification: "",
            }}
            validationSchema={createAccountFormSchema[step]}
            onSubmit={async (values, helpers) => {
              if (step === 1) {
                setSuccess(await props.handleSubmit(values, helpers));
                return;
              } else if (
                step === 0 &&
                (await props.userExists(values.username, values.email))
              ) {
                helpers.setSubmitting(false);
                return;
              }
              incrementStep();
              helpers.setSubmitting(false);
            }}
          >
            {(formik) => (
              <Form
                className="d-flex flex-column flex-fill"
                onSubmit={formik.handleSubmit}
                noValidate
              >
                {renderStep(formik)}
              </Form>
            )}
          </Formik>
        </Col>
      </Row>
    </>
  );
}

function StepOne({ formik }) {
  return (
    <>
      <Row className="mb-2">
        <Form.Group as={Col}>
          <Form.Label>First Name</Form.Label>
          <InputGroup hasValidation>
            <Form.Control
              id="firstName"
              placeholder="First name"
              isInvalid={!!formik.errors.firstName}
              {...formik.getFieldProps("firstName")}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.firstName}
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Label>Last Name</Form.Label>
          <InputGroup hasValidation>
            <Form.Control
              id="lastName"
              placeholder="Last name"
              isInvalid={!!formik.errors.lastName}
              {...formik.getFieldProps("lastName")}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.lastName}
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
      </Row>
      <Row className="mb-2">
        <Form.Group as={Col}>
          <Form.Label>Username</Form.Label>
          <InputGroup hasValidation>
            <Form.Control
              id="username"
              placeholder="Username"
              isInvalid={!!formik.errors.username}
              {...formik.getFieldProps("username")}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.username}
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
      </Row>
      <Row className="mb-2">
        <Form.Group as={Col}>
          <Form.Label>Email</Form.Label>
          <InputGroup hasValidation>
            <Form.Control
              id="email"
              type="email"
              placeholder="Email"
              isInvalid={!!formik.errors.email}
              {...formik.getFieldProps("email")}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.email}
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group as={Col}>
          <Form.Label>Password</Form.Label>
          <InputGroup hasValidation>
            <Form.Control
              id="password"
              type="password"
              placeholder="Password"
              isInvalid={!!formik.errors.password}
              {...formik.getFieldProps("password")}
            />
            <Form.Text muted>
              Your password must be 8-20 characters long, contain letters,
              numbers and special characters, and must not contain spaces, or
              emoji.
            </Form.Text>
            <Form.Control.Feedback type="invalid">
              {formik.errors.password}
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
      </Row>
      <Row className="mb-4">
        <Form.Group as={Col}>
          <Form.Label> Password Confirmation</Form.Label>
          <InputGroup hasValidation>
            <Form.Control
              id="passwordConfirmation"
              type="password"
              placeholder=" Password confirmation"
              isInvalid={!!formik.errors.passwordConfirmation}
              {...formik.getFieldProps("passwordConfirmation")}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.passwordConfirmation}
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
      </Row>
      <Button variant="primary" type="submit" disabled={formik.isSubmitting}>
        Next
      </Button>
    </>
  );
}

function StepTwo({ formik, decrementStep }) {
  return (
    <>
      <Row className="mb-3">
        <Form.Group as={Col}>
          <Form.Label>Occupation</Form.Label>
          <InputGroup hasValidation>
            <Form.Control
              id="occupation"
              placeholder="Occupation"
              isInvalid={!!formik.errors.occupation}
              {...formik.getFieldProps("occupation")}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.occupation}
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
      </Row>
      <Row className="mb-4">
        <Form.Label className="mb-0">Justification</Form.Label>
        <Form.Text className="mb-2" muted>
          Provide a justification for your access request. 200 characters
          maximum.
        </Form.Text>
        <InputGroup hasValidation>
          <Form.Control
            id="justification"
            as="textarea"
            placeholder="Justification"
            style={{ height: "100px" }}
            isInvalid={!!formik.errors.justification}
            {...formik.getFieldProps("justification")}
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.justification}
          </Form.Control.Feedback>
        </InputGroup>
      </Row>
      <Row>
        <Col className="d-flex justify-content-center">
          <Button
            className="flex-fill"
            variant="secondary"
            onClick={decrementStep}
          >
            Back
          </Button>
        </Col>
        <Col className="d-flex justify-content-center">
          <Button className="flex-fill" type="submit">
            Submit
          </Button>
        </Col>
      </Row>
    </>
  );
}

CreateAccount.propTypes = {
  loading: PropTypes.bool,
  handleSubmit: PropTypes.func,
  userExists: PropTypes.func,
};

StepOne.propTypes = {
  formik: PropTypes.object,
};

StepTwo.propTypes = {
  formik: PropTypes.object,
  decrementStep: PropTypes.func,
};
