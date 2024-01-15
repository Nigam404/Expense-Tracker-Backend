//Login button click event..........................................................................
async function login(event) {
  event.preventDefault();
  let obj = {
    mail: document.getElementById("mail").value,
    password: document.getElementById("password").value,
  };

  try {
    let info = await axios.post("http://51.20.183.75:3000/login", obj);
    if (info.status == 200) {
      const resDiv = document.getElementById("result");
      resDiv.innerText = info.data.message;
      alert(info.data.message);

      localStorage.setItem("Token", info.data.token); //saving token in local storage.
      location.replace("home.html");
    }
  } catch (error) {
    //to catch error coming from backend.
    console.log(error);
    alert(error.response.data);
  }
}

//Forgot password button click event.................................................................
const forgotPwBtn = document.getElementById("forgotpw");
forgotPwBtn.onclick = async () => {
  let email = prompt("Enter your email id");
  let obj = {
    mail: email,
  };
  console.log(obj);

  const response = await axios.post(
    "http://51.20.183.75:3000/password/forgotpassword",
    obj
  );
};
