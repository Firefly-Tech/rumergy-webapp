import { useEffect } from "react";
import { useAuth } from "./use-auth.js";
import { useHistory } from "react-router-dom";
import { roles } from "./constants.js";

export function useRequireAuth(
  redirectUrl = "/login",
  permissions = [roles.General]
) {
  const auth = useAuth();
  const history = useHistory();
  // If auth.user is false that means we're not
  // logged in and should redirect.
  useEffect(() => {
    if (auth.user === false) {
      history.push(redirectUrl);
    } else if (auth.role && !permissions.includes(auth.role)) {
      history.push("/");
    }
  }, [auth]);
  return auth;
}
