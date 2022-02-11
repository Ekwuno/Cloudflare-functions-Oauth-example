const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
  "Access-Control-Max-Age": "86400",
  "Access-Control-Allow-Headers": "content-type"
};

const corsHandler =  async ({ next }) => {
  const response = await next();
  response.headers.set("Access-Control-Allow-Origin", "*");
  return response;
};

const corsOptionsHandler = async ({ next }) => {
    return new Response(null, {
        headers: corsHeaders,
    })
}


export const onRequestPost = [corsHandler]
export const onRequestGet = [corsHandler];
export const onRequestOptions = [corsOptionsHandler]