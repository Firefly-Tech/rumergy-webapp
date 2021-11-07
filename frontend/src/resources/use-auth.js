import React, { useState, useEffect, useContext, createContext } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { roles } from "./constants";

const authContext = createContext();
const apiHost = process.env.REACT_APP_API_HOST;

// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

ProvideAuth.propTypes = {
  children: PropTypes.object,
};

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuth = () => {
  return useContext(authContext);
};
// Provider hook that creates auth object and handles state
function useProvideAuth() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(roles.General);
  const [accessToken, setAccessToken] = useState(null);

  const signin = (username, password) => {
    return axios
      .post(`${apiHost}/api/token/`, {
        username: username,
        password: password,
      })
      .then((res) => {
        setAccessToken(res.data.access);
        setUser(res.data.user);
        setRole(res.data.user.role);
        localStorage.setItem("refresh", res.data.refresh);

        return "OK";
      })
      .catch((error) => {
        if (error.response) {
          return "Unauthorized";
        } else if (error.request) {
          return "No response";
        } else {
          return "Unknown error";
        }
      });
  };
  const signup = (username, password, email, firstName, lastName) => {};
  const signout = () => {
    setUser(null);
    setAccessToken(null);
    setRole(roles.General);
    localStorage.removeItem("refresh");

    return true;
  };
  const getAuthBearer = () => {
    return `Bearer ${accessToken}`;
  };
  const sendPasswordResetEmail = (email) => {};
  const confirmPasswordReset = (code, password) => {};

  // Subscribe to user on mount
  // Because this sets state in the callback it will cause any ...
  // ... component that utilizes this hook to re-render with the ...
  // ... latest auth object.

  // TODO: Add error catching and other cases
  useEffect(() => {
    const unsubscribe = () => {
      axios
        .post(`${apiHost}/api/refresh/`, {
          refresh: localStorage.getItem("refresh"),
        })
        .then((res) => {
          setAccessToken(res.data.access);
        });
      axios
        .get(`${apiHost}/api/users/get_user_from_auth`, {
          headers: { Authorization: getAuthBearer() },
        })
        .then((res) => {
          let temp = res.data.user;
          const { profile, ...user } = temp;
          setUser(user);
          setRole(profile.role);
        });
    };
    return () => unsubscribe();
  }, []);
  // Return the user object and auth methods
  return {
    user,
    accessToken,
    role,
    signin,
    signup,
    signout,
    sendPasswordResetEmail,
    confirmPasswordReset,
  };
}
