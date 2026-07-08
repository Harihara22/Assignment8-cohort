if (localStorage.getItem("isLoggedIn") === "true") {
  window.location.replace("dashboard.html");
}

const usernameR = document.querySelector("#usernameIdR");
const passwordR = document.querySelector("#passwordIdR");
const formR = document.querySelector("form");

let userId = JSON.parse(localStorage.getItem("lastUserId")) || 0;

formR.addEventListener("submit", (elem) => {
  elem.preventDefault();
  let nameEntered = usernameR.value;
  let passwordEntered = passwordR.value;

  let userData = JSON.parse(localStorage.getItem("registerdUsers")) || [];

  const isuserExist = userData.some((e) => {
    return e.username === nameEntered;
  });

  if (isuserExist) {
    alert(`${nameEntered} already exist, try another username`);
    window.location.href = "index.html";
    return;
  }
  userId++;
  userData.push({
    id: userId,
    username: nameEntered,
    password: passwordEntered,
  });

  localStorage.setItem("lastUserId", JSON.stringify(userId));
  localStorage.setItem("registerdUsers", JSON.stringify(userData));
  window.location.href = "index.html";

  alert(`${nameEntered}!! registation completed`);
});
