import config from "../config";
import qs from "qs";

function askForConsent() {
  const oAuthQueryParams = {
    response_type: "code",
    scope: "user public_repo",
    redirect_uri: config.REDIRECT_URI,
    client_id: config.CLIENT_ID,
    state: "random_state_string",
  };

  const query = qs.stringify(oAuthQueryParams);
  const url = `${config.AUTHORIZATION_ENDPOINT}?${query}`;
  const loginLink = document.querySelector("a");
  loginLink.setAttribute("href", url);
}

window.onload = function () {
  askForConsent();
};
