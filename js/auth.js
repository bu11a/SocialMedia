export function register(login, password) {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const userExists = users.find(function(user) {
        return user.login === login;
    });

    if (userExists) {
        return false;
    }

    const user = {
        login: login,
        password: password
    };

    users.push(user);

    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(user));

    return true;
}


export function login(login, password) {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(function(user) {
        return user.login === login && user.password === password;
    });

    if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user));
        return true;
    }

    return false;
}


export function logout() {
    localStorage.removeItem("currentUser");
}


export function getCurrentUser() {
    return JSON.parse(localStorage.getItem("currentUser"));
}