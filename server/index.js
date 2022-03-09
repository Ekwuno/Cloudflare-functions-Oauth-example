// import express from 'express'
// import cors from 'cors'
// // import config from '../config.js'
// import fetch from 'node-fetch'
// import qs from 'query-string'
// import JsonWebToken from 'jsonwebtoken'
// const app = express()

// app.use(cors())
// app.use(express.json())

// const userDatabase =[]

// app.post('/code', async function(req,res){
//     try {
//         const token = await exchangeCodeForToken(req.body.code)
//         const user = await fetchUser(token)
//         const jwt = await encodeJWT(user,token)
//         //  const decoded = await verifyJWT(jwt, token);
//         //  console.log(decoded);
//        userDatabase.push({jwt,user,token})

//         res.json({jwt})
//     } catch (error) {
//         console.log(error)
//         res.send(error)
//     }
    
// })

// app.get('/repos', async function(req,res){
//     try {
//         const jwt = req.headers.authorization.split(' ')[1]
//         const user = userDatabase.find(user => user.jwt === jwt)
//         const token = user.token
//         await verifyJWT(jwt,token)

//         const repos = await fetchRepos(token)
//         res.json(repos)
//     } catch (error) {
//         console.log(error)
//         res.send(error)
//     }
// })

// app.listen(1235,function(){
//     console.log("listening for code" )
// })

// const config = {
//   CLIENT_ID: "d00bdb1af84c4faef82c",
//   CLIENT_SECRET: "5735f21e979685a52a7de10e30c936c661b565a5",
//   REDIRECT_URL: "http://localhost:1234/",
//   AUTHORIZATION_ENDPOINT: "https://github.com/login/oauth/authorize",
//   TOKEN_ENDPOINT: "https://github.com/login/oauth/access_token",
//   RESOURCE_ENDPOINT: "https://api.github.com/",
// };

// async function exchangeCodeForToken(code){
//     const TokenURL = config.TOKEN_ENDPOINT;
//     const oAuthQueryParams = {
//         grant_type: "authorization_code",
//         redirect_url: config.REDIRECT_URL,
//         client_id: config.CLIENT_ID,
//         client_secret: config.CLIENT_SECRET,
//         code: code
//     }

//     const res = await fetch(TokenURL,{
//         body: JSON.stringify(oAuthQueryParams),
//         method: "POST",
//         headers:{'Content-Type' :'application/json' }
//     })

//     const data = await res.text()
//     const parsedData = qs.parse(data)
//     return parsedData.access_token
// }

// async function fetchUser(token){
//     const userURL = config.RESOURCE_ENDPOINT + "user"
//     const res = await fetch(userURL,{
//         headers:{
//             'Authorization': `token ${token}`
//         }
//     })

//     const data = await res.json()
//     return data
// }

// async function encodeJWT(user,token){
//    const jwtPayload = {
//        login: user.login,
//          id: user.id,
//         avatar_url: user.avatar_url,
//    }

//    return JsonWebToken.sign(jwtPayload,token,{expiresIn: '1h'})

// }

// async function verifyJWT(jwt,token){
//     return JsonWebToken.verify(jwt,token)
// }

// async function fetchRepos(token){
//    const url = `${config.RESOURCE_ENDPOINT}user/repos?per_page=100`
//     const res = await fetch(url,{
//         headers:{
//             'Authorization': `Bearer ${token}`
//         },
//     })

//     const data = await res.json()
//     console.log(data)
//     return data
// }