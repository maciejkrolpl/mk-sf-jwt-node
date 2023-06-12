# mk-sf-jwt-node

Small and dependencies-less package to connect to Salesforce from Node.js app.

## Create certificate and private key

`$ openssl req  -nodes -new -x509  -keyout myKey.pem -out server.cert`

## Create Connected App

Setup ➡️ App Manager ➡️ New Connected App

Enable OAuth Settings

Callback URL ➡️ `sfdc://oauth/jwt/success`

Use digital signatures ➡️ Upload your `server.cert`

Selected OAuth Scopes - per requirments (full, refresh_token, offline_access)

Save

Manage Consumer Details ➡️ Note your app's Consumer Key

Manage ➡️ Edit policies ➡️ Permitted Users ➡️ Admin approved users are pre-authorized ➡️ Save

Add Profiles od Permission Sets that would have access to Connected App.

## Example usage (with jsforce)

```javascript
import getJWT from "mk-sf-jwt-node";
import jsforce from 'jsforce';
import fs from 'fs';

const privateKey = fs.readFileSync('<path to your myKey.key file>', 'utf-8');

const options = {
  iss: '<Connected App's Consumer Key>',
  sub: '<Username>',
  aud: '<https://login.salesforce.com/ or https://test.salesforce.com/ >',
  privateKey
}

const {access_token, instance_url} = await getJWT(options)

const conn = new jsforce.Connection({
  instanceUrl: instance_url,
  accessToken: access_token
})

const accounts = await conn.query('SELECT Id, Name FROM Account LIMIT 5');

console.log(accounts);
```

## Example usage (using Rest API)

```javascript
import getJWT from "mk-sf-jwt-node";
import fs from "fs";
import axios from "axios";

const privateKey = fs.readFileSync('<path to your myKey.key file>', 'utf-8');

const options = {
  iss: '<Connected App's Consumer Key>',
  sub: '<Username>',
  aud: '<https://login.salesforce.com/ or https://test.salesforce.com/ >',
  privateKey
}

const { access_token, instance_url } = await getJWT(options);

const endpoint = "/services/data/v55.0/query/?q=SELECT Id, Name FROM Account LIMIT 5";

try {
  const response = await axios.get(`${instance_url}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  console.log(response.data);
} catch (error) {
  console.error(error);
}
```