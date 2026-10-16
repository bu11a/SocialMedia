import { getCurrentUser } from "./auth.js";

let favorites = [];

export function startFavorites() {
    const favoriteBtn = document.querySelector("#favoriteBtn");
    const favoriteModal = document.querySelector("#favoritesModal");
    const closeFavorite = document.querySelector("#closeFavorites");

    function loadFavorites() {
        const user = getCurrentUser();

        if (user) {
            favorites = JSON.parse(
                localStorage.getItem("favorites_" + user.login) || "[]"
            );
        } else {
            favorites = [];
        }
    }

    function saveFavorites() {
        const user = getCurrentUser();

        if (user) {
            localStorage.setItem(
                "favorites_" + user.login,
                JSON.stringify(favorites)
            );
        }
    }

    favoriteBtn.addEventListener("click", function () {
        if (!getCurrentUser()) {
            alert("First log in");
            return;
        }

        loadFavorites();
        renderFavorites();
        favoriteModal.classList.add("active");
    });

    closeFavorite.addEventListener("click", function () {
        favoriteModal.classList.remove("active");
    });

    favoriteModal.addEventListener("click", function (event) {
        if (event.target === favoriteModal) {
            favoriteModal.classList.remove("active");
        }
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            favoriteModal.classList.remove("active");
        }
    });

    document.addEventListener("click", function (event) {
        const button = event.target.closest(".favorite-button");

        if (!button) {
            return;
        }

        const user = getCurrentUser();

        if (!user) {
            alert("First log in");
            return;
        }

        loadFavorites();

        const id = String(button.dataset.id);

        if (favorites.includes(id)) {
            favorites = favorites.filter(function (item) {
                return item !== id;
            });
        } else {
            favorites.push(id);
        }

        saveFavorites();
        updateFavoriteButtons();
    });

    function updateFavoriteButtons() {
        document.querySelectorAll(".favorite-button").forEach(function (button) {
            const id = String(button.dataset.id);

            button.textContent = favorites.includes(id)
                ? "Remove Favorite"
                : "Favorite";
        });

        if (favoriteModal.classList.contains("active")) {
            renderFavorites();
        }
    }

    function renderFavorites() {
        const container = document.querySelector("#favoritesContainer");

        container.innerHTML = "";

        if (favorites.length === 0) {
            container.innerHTML = "<p>Favorites is empty</p>";
            return;
        }

        favorites.forEach(function (id) {
            const originalButton = document.querySelector(
                '#postsContainer .favorite-button[data-id="' + id + '"]'
            );

            if (!originalButton) {
                return;
            }

            const post = originalButton.closest(".post");

            if (!post) {
                return;
            }

            const copy = post.cloneNode(true);
            const favoriteButton = copy.querySelector(".favorite-button");

            if (favoriteButton) {
                favoriteButton.textContent = "Remove Favorite";
            }

            container.append(copy);
        });

        if (container.children.length === 0) {
            container.innerHTML = "<p>Can't find this posts.</p>";
        }
    }
}