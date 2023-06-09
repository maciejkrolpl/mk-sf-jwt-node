import https from "https";
import querystring from "querystring";

export default async function makePostRequest(postUrl, bearerToken) {
  const payload = querystring.stringify({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion: bearerToken,
  });

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": Buffer.byteLength(payload),
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(postUrl, options, (res) => {
      let responseData = "";

      res.on("data", (chunk) => {
        responseData += chunk;
      });

      res.on("end", () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(responseData);
        } else {
          reject(
            new Error(
              `Request failed with status code ${res.statusCode}: ${responseData}`
            )
          );
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.write(payload);
    req.end();
  });
}
