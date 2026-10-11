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

    if (passwordInput.length < 8) {
        alert("Пароль должен содержать минимум 8 символов");
        return;
    }

    if (!/[A-Z]/.test(passwordInput)) {
        alert("Добавьте хотя бы одну заглавную букву (A-Z)");
        return;
    }

    if (!/[a-z]/.test(passwordInput)) {
        alert("Добавьте хотя бы одну маленькую букву (a-z)");
        return;
    }

    if (!/[0-9]/.test(passwordInput)) {
        alert("Добавьте хотя бы одну цифру (0-9)");
        return;
    }

    if (!/[^A-Za-z0-9]/.test(passwordInput)) {
        alert("Добавьте хотя бы один специальный символ (@, _, -, !)");
        return;
    }

    const result = register(loginInput, passwordInput);

    if (result) {
        alert("Регистрация успешна!");
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