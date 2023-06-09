import makePostRequest from "./postRequest.js";
import Jwt from "./jwt.js";


export default async function getJWT(options) {
  const jwt = new Jwt(options);
  const bearerToken = jwt.bearerToken;
  const postUrl = jwt.postUrl;
  return await makePostRequest(postUrl, bearerToken);
}