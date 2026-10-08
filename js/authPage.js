import { register, login } from "./auth.js";

const registerBtn = document.querySelector("#registerBtn");
const loginBtn = document.querySelector("#loginBtn");

registerBtn.addEventListener("click", function() {
    const loginInput = document.querySelector("#registerLogin").value.trim();
    const passwordInput = document.querySelector("#registerPassword").value;

    if (loginInput === "" || passwordInput === "") {
        alert("Заполните все поля");
        return;
    }

    const result = register(loginInput, passwordInput);

    if (result) {
        window.location.href = "index.html";
    } else {
        alert("Такой логин уже существует");
    }
});

loginBtn.addEventListener("click", function() {
    const loginInput = document.querySelector("#loginLogin").value.trim();
    const passwordInput = document.querySelector("#loginPassword").value;

    if (loginInput === "" || passwordInput === "") {
        alert("Заполните все поля");
        return;
    }

    const result = login(loginInput, passwordInput);

    if (result) {
        window.location.href = "index.html";
    } else {
        alert("Неправильный логин или пароль");
    }
});