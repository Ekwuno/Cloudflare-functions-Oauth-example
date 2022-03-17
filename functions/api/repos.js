import jwt from "@tsndr/cloudflare-worker-jwt";
import { myVerySecretString } from "./code";

export async function onRequestGet({ request, env }) {
  try {
    const token = request.headers.get("Authorization").split(" ")[1];

    // verify JWT
    const verifiedJWT = await jwt.verify(token, myVerySecretString)
    if (!verifiedJWT) {
      return new Response("Not valid JWT", {status: 401})
    }
    
    const decodedJwt = jwt.decode(token)

    const user = await env.kv_userDatabase.get(`${decodedJwt.id}`, "json")

    if (!user) {
      return new Response("User not found", {status: 404})
    }

    const repos = await fetchRepos(user.token);
    return new Response(JSON.stringify(repos));
    // res.json(repos); // Send repos to client
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error }));
  }
}

const config = {
  CLIENT_ID: "d00bdb1af84c4faef82c",
  CLIENT_SECRET: "16bf26fbf9fc5aad2f1eee3b94c5d6363d13470d",
  REDIRECT_URL: "http://localhost:8788/",
  AUTHORIZATION_ENDPOINT: "https://github.com/login/oauth/authorize",
  TOKEN_ENDPOINT: "https://github.com/login/oauth/access_token",
  RESOURCE_ENDPOINT: "https://api.github.com/",
};



// // async function verifyJWT(jwt, token) {
// //   const decoded = await jwts.verify(jwt, token);
// //   console.log(decoded);
// //   return await jwt.verify(token, "secret");
// //   // return jwts.verify(jwt, token);
// // }

// async function verifyJWT(jwt, token) {
//   return jwts.verify(jwt, token);
//   // return jwts.verify(jwt, token);
// }

 async function fetchRepos(token) {
   console.log(token)
   const url = `${config.RESOURCE_ENDPOINT}user/repos?sort=created&direction=asc`;
   const res = await fetch(url, {
     headers: {
       Authorization: `Bearer ${token}`,
       "user-agent": "Pages Functions"
     },
   });

   const data = await res.json();
   return data;
 }
