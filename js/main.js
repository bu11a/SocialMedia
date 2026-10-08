import { getPosts } from "./api.js";
import { renderPosts } from "./posts.js";
import { initFavorites } from "./favorites.js";
import { getCurrentUser, logout } from "./auth.js";

async function start() {
    const loader = document.querySelector("#loader");
    const authBtn = document.querySelector("#authBtn");
    const logoutBtn = document.querySelector("#logoutBtn");
    const user = getCurrentUser();
    if (user) {
        authBtn.style.display = "none";
        logoutBtn.style.display = "flex";
    } else {
        authBtn.style.display = "flex";
        logoutBtn.style.display = "none";
    }
    logoutBtn.addEventListener("click", function() {
        logout();
        window.location.reload();
    });
    loader.style.display = "block";
    try {
        const posts = await getPosts();
        renderPosts(posts);
        initFavorites();
    } catch (error) {
        console.log(error);
        loader.textContent = "Ошибка загрузки";
    }
    loader.style.display = "none";
}
start();