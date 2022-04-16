import qs from "query-string";
import jwt from "@tsndr/cloudflare-worker-jwt";
// import jwt from "@tsndr/cloudflare-worker-jwt";

// Workers env variable
export const myVerySecretString = "gfddfshgfhd65345234bvcfdgsfsd";

export async function onRequest({ request, env }) {
  try {
    const code = new URL(request.url).searchParams.get("code");
    if (!code) return next();

    const token = await exchangeCodeForToken(code);
    const user = await fetchUser(token);
    const jwtencoded = await encodeJWT(user, myVerySecretString);

    await env.kv_userDatabase.put(
      `${user.id}`,
      JSON.stringify({ user, token })
    );

    console.log(jwtencoded);
    return new Response(JSON.stringify({ jwtencoded }), {
      headers: {
        "Content-Type": "application/json",
      },
    });
    // res.json({ jwt });
  } catch (error) {
    console.log(error);
    // res.send(error);
    return new Response(JSON.stringify({ error: `${error}` }));
  }
}

const config = {
  CLIENT_ID: "d00bdb1af84c4faef82c",
  CLIENT_SECRET: "1875475451faf4c8bc1fdc69033fb4da6441d145",
  REDIRECT_URL:
    "https://test-functions.cloudflare-functions-oauth-example.pages.dev/",
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
  console.log(parsedData.access_token);
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
  const jwtPayload = {
    login: user.login,
    id: user.id,
    avatar_url: user.avatar_url,
  };

  return jwt.sign(jwtPayload, token);
  // return token; // Can't use JsonWebToken because it's not available in workers
}
