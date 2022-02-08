export async function onRequest({request}) {
 const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
  "Access-Control-Max-Age": "86400",
}
console.log(request.body)
// const response = await request.json()
}
