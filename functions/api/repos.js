import jwts from "@tsndr/cloudflare-worker-jwt";
export async function onRequestGet({ request, env }) {
  try {
    const jwt = request.headers.get("Authorization").split(" ")[1];
    const userString = await env.kv_userDatabase.get(jwt);
    // const user = userDatabase.find((user) => user.jwt === jwt); // Get user info from KV

    const user = JSON.parse(userString);
    const token = user.token;

    await verifyJWT(jwt, token);

    const repos = await fetchRepos(token);
    return new Response(JSON.stringify(repos));
    // res.json(repos); // Send repos to client
  } catch (error) {
    console.log(error);
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

async function verifyJWT(jwt, token) {
  return jwts.verify(jwt, token);
}
async function fetchRepos(token) {
  const url = `${config.RESOURCE_ENDPOINT}user/repos?per_page=100`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  console.log(data);
  //   return data;
}
