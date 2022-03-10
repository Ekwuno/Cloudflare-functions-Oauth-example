import config from "../config";
import qs from "query-string";

function  getAppauthorization() {
  const oAuthQueryParams = {
    response_type: "code",
    scope: "user public_repo",
    redirect_url: config.REDIRECT_URL,
    client_id: config.CLIENT_ID,
    state: "random_state_string",
  };

  const query = qs.stringify(oAuthQueryParams);
  const url = `${config.AUTHORIZATION_ENDPOINT}?${query}`;
  const loginLink = document.querySelector("a");
  loginLink.setAttribute("href", url);
}


function handleCode(){
  const parsedQuery = qs.parseUrl(window.location.href)

  if(parsedQuery.query.code){
    sendCodeToServer()
  }else{
    throw new Error("No code found in url")
  }

  async function sendCodeToServer(){
    const server = "http://localhost:8788/api/code"
    try {
      const res = await fetch(server,{
        method: "POST",
        body: JSON.stringify({
          code: parsedQuery.query.code,
          state: parsedQuery.query.state
        }),
        headers:{'Content-Type' :'application/json' }
      })
      
      const data = await res.json() 
      console.log("hellloo ", data)
      localStorage.setItem("jwt", data.jwtencoded);
      window.location.href = config.REDIRECT_URL;
      
    } catch (error) {
      console.log(error)
    }
  }
}

// function protectedRequest(){
//   const requestButton = document.querySelector('button');
//   requestButton.style.display = "none"

//   if(localStorage.getItem('jwt')){
//     requestButton.style.display = "block"
//     requestButton.addEventListener('click',function(){
//       fetchRepos()
//     })
//   }

//   async function fetchRepos() {
//     const server = "http://localhost:8788/api/repos";
//     try {
//       const res = await fetch(server, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("jwt")}`,
//         },
//       });
//       const data = await res.json();
//       console.log(data);
//     } catch (error) {
//       console.log(error);
//     }
//   }
// }


const requestButton = document.querySelector("button");

requestButton.style.display = "none";

if (localStorage.getItem("jwt")) {
  requestButton.style.display = "block";
  requestButton.addEventListener("click", function () {
    fetchRepos();
  });
}

async function fetchRepos() {
  const server = "http://localhost:8788/api/repos";
  try {
    const res = await fetch(server, {
      headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
    });

    const data = await res.json();
    console.log(data);
  } catch (error) {
    console.log(error);
  }
}



window.onload = function () {
    getAppauthorization();
    handleCode();
    // protectedRequest();    
};
