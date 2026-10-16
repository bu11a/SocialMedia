import { getCurrentUser, logout } from "./auth.js";

const user = getCurrentUser();

if (!user) {
    window.location.href = "auth.html";
} else {
    start();
}

function start() {
    const container = document.querySelector("#myPostsContainer");
    const count = document.querySelector("#myPostsCount");
    const logoutBtn = document.querySelector("#logoutBtn");

    logoutBtn.addEventListener("click", function () {
        logout();
        window.location.href = "index.html";
    });

    renderMyPosts();

    function renderMyPosts() {
        const allMyPosts = JSON.parse(
            localStorage.getItem("myPosts") || "[]"
        );

        const userPosts = allMyPosts.filter(function (post) {
            return post.author === user.login;
        });

        container.innerHTML = "";
        count.textContent = "Всего публикаций: " + userPosts.length;

        if (userPosts.length === 0) {
            container.innerHTML = "<p class='empty-posts'>У тебя пока нет публикаций.</p>";
            return;
        }

        userPosts.forEach(function (post) {
            const postElement = document.createElement("div");
            postElement.className = "post my-post-card";

            const image = post.image || "";
            const description =
                post.description ||
                post.main_content ||
                post.body ||
                "";

            postElement.innerHTML = `
                ${image ? `
                    <img
                        src="${image}"
                        alt="Изображение публикации"
                        class="post-image"
                    >
                ` : ""}

                <h3></h3>
                <p class="my-post-description"></p>
                <p class="my-post-category"></p>
                <button class="delete-post-button" data-id="${post.id}">
                    Удалить публикацию
                </button>
            `;

            postElement.querySelector("h3").textContent =
                post.title || "Без названия";

            postElement.querySelector(".my-post-description").textContent =
                description;

            postElement.querySelector(".my-post-category").textContent =
                "Категория: " + (post.category || "Другое");

            container.append(postElement);
        });
    }

    container.addEventListener("click", function (event) {
        const button = event.target.closest(".delete-post-button");

        if (!button) {
            return;
        }

        const id = String(button.dataset.id);

        const confirmed = confirm(
            "Точно удалить эту публикацию? Восстановить её будет нельзя."
        );

        if (!confirmed) {
            return;
        }

        let allMyPosts = JSON.parse(
            localStorage.getItem("myPosts") || "[]"
        );

        const postToDelete = allMyPosts.find(function (post) {
            return String(post.id) === id &&
                post.author === user.login;
        });

        if (!postToDelete) {
            alert("Публикация не найдена.");
            return;
        }

        allMyPosts = allMyPosts.filter(function (post) {
            return !(
                String(post.id) === id &&
                post.author === user.login
            );
        });

        localStorage.setItem("myPosts", JSON.stringify(allMyPosts));

        const favoritesKey = "favorites_" + user.login;

        let favorites = JSON.parse(
            localStorage.getItem(favoritesKey) || "[]"
        );

        favorites = favorites.filter(function (favoriteId) {
            return String(favoriteId) !== id;
        });

        localStorage.setItem(
            favoritesKey,
            JSON.stringify(favorites)
        );

        renderMyPosts();
    });
}