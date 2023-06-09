import { createSign } from "node:crypto";

export default class Jwt {
  MINUTES_VALID = 5;

  constructor(options) {
    this.validateOptions(options);
    this.iss = options.iss;
    this.sub = options.sub;
    this.aud = options.aud;
    this.privateKey = options.privateKey;
  }

  get bearerToken() {
    const payload = this.generatePayload();
    const sign = createSign("RSA-SHA256");
    sign.write(payload, "utf-8");
    sign.end();

    const signature = sign.sign(privateKey);
    const signed = signature
      .toString("base64")
      .replace(/\//g, "_")
      .replace(/\+/g, "-")
      .replace(/=+$/, "");
    const bearerToken = existing_string + "." + Buffer.from(signed);
    return bearerToken;
  }

  get postUrl() {
    return `${this.aud}services/oauth2/token`;
  }

  generatePayload() {
    const header = { alg: "RS256" };
    const claimsSet = {
      iss: this.iss,
      sub: this.sub,
      aud: this.aud,
      exp: Math.floor(Date.now() / 1000) + 60 * this.MINUTES_VALID,
    };

    const encodedHeader = Buffer.from(JSON.stringify(header)).toString(
      "base64"
    );
    const encodedClaimsSet = Buffer.from(JSON.stringify(claimsSet)).toString(
      "base64"
    );

    const payload = encodedHeader + "." + encodedClaimsSet;
    return payload;
  }

  validateOptions(options) {
    if (!options || !options instanceof Object) {
      throw new Error("Missing parameters");
    }
    const optionsToValidate = ["iss", "sub", "aud", "privateKey"];
    const missingOptions = optionsToValidate.filter(
      (option) => !options.hasOwnProperty(option) || !options[option]
    );
    if (missingOptions.length) {
      throw new Error("Missing parameters: " + missingOptions);
    }
  }
}
