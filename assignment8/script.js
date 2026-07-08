if (localStorage.getItem("isLoggedIn") === "true") {
    window.location.replace("dashboard.html");
}

const username = document.querySelector("#usernameId");
const password = document.querySelector("#passwordId");
const form = document.querySelector("form");



let userData = JSON.parse(localStorage.getItem("registerdUsers")) || [];



form.addEventListener("submit", (elem) => {
  elem.preventDefault();
    let nameEntered=username.value
    let passwordEntered=password.value

    const isregistered=userData.find((e)=>{
        return e.username===nameEntered && e.password===passwordEntered
    })

    if(isregistered){
        localStorage.setItem(
        "curentuserId",
        JSON.stringify(isregistered.id)
    );
        alert(`${nameEntered} is loged-in succesfully`);
        localStorage.setItem("isLoggedIn", "true");
        window.location.replace("dashboard.html")
    }else{
        alert(`${nameEntered}!!!! loged-in failed register Now`)
        window.location.href="register.html";
    }
});

