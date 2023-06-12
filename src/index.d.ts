declare module 'mk-sf-jwt-node' {
  interface Options {
    iss: string,
    sub: string,
    aud: string,
    privateKey: string
  }

  interface Token {
    access_token: string,
    scope: string,
    instance_url: string,
    id: string,
    token_type: string
  }

  function getJWT(options: Options): Promise<Token>;

  export = {
    getJWT
  }
}