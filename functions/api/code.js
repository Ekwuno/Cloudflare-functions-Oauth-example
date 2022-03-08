import qs from "query-string";
// import jwt from "@tsndr/cloudflare-worker-jwt";

export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json();
    console.log(body) // use request.json  to make request body a readable stream
    const token = await exchangeCodeForToken(body.code);
    const user = await fetchUser(token);
    const jwtencoded = await encodeJWT(user, token);

    await env.kv_userDatabase.put(
      jwtencoded,
      JSON.stringify({ jwt: jwtencoded, user, token })
    );
    return new Response(JSON.stringify({ jwtencoded }));
    // res.json({ jwt });
  } catch (error) {
    console.log(error);
    // res.send(error);
    return new Response(JSON.stringify({ error }));
  }
}

const config = {
  CLIENT_ID: "d00bdb1af84c4faef82c",
  CLIENT_SECRET: "5735f21e979685a52a7de10e30c936c661b565a5",
  REDIRECT_URL: "http://localhost:8788/",
  AUTHORIZATION_ENDPOINT: "https://github.com/login/oauth/authorize",
  TOKEN_ENDPOINT: "https://github.com/login/oauth/access_token",
  RESOURCE_ENDPOINT: "https://api.github.com/",
};

async function exchangeCodeForToken(code) {
  const TokenURL = config.TOKEN_ENDPOINT;
  const oAuthQueryParams = {
    grant_type: "authorization_code",
    redirect_url: config.REDIRECT_URL,
    client_id: config.CLIENT_ID,
    client_secret: config.CLIENT_SECRET,
    code: code,
  };

  const res = await fetch(TokenURL, {
    body: JSON.stringify(oAuthQueryParams),
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.text();
  const parsedData = qs.parse(data);
  return parsedData.access_token;
}

async function fetchUser(token) {
  const userURL = config.RESOURCE_ENDPOINT + "user";
  const res = await fetch(userURL, {
    headers: {
      Authorization: `token ${token}`,
      "User-Agent": "Mozilla/5.0", // Add user agent for GitHub API when using workers
    },
  });

  const data = await res.json();
  console.log(data);
  return data;
}

async function encodeJWT(user, token) {
  const jwt = require("@tsndr/cloudflare-worker-jwt");
  const jwtPayload = {
    login: user.login,
    id: user.id,
    avatar_url: user.avatar_url,
  };
  
  return jwt.sign(jwtPayload, token);
  // return token; // Can't use JsonWebToken because it's not available in workers
}
