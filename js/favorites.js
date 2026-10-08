import { getCurrentUser } from "./auth.js";
let favorites = [];
export function initFavorites() {
    const favoriteBtn = document.querySelector("#favoriteBtn");
    const favoriteModal = document.querySelector("#favoriteModal");
    const closeFavorite = document.querySelector("#closeFavorite");
    const user = getCurrentUser();
    if (user) {
        const savedFavorites = localStorage.getItem(
            "favorites_" + user.login
        );
        favorites = JSON.parse(savedFavorites) || [];
    }
    favoriteBtn.addEventListener("click", function() {
        const currentUser = getCurrentUser();
        if (!currentUser) {
            alert("Сначала войдите в аккаунт");
            return;
        }
        renderFavorites();
        favoriteModal.classList.add("active");
    });

    closeFavorite.addEventListener("click", function() {
        favoriteModal.classList.remove("active");
    });

    favoriteModal.addEventListener("click", function(event) {

        if (event.target === favoriteModal) {
            favoriteModal.classList.remove("active");
        }
    });

    document.addEventListener("keydown", function(event) {
        if (event.key === "Escape") {
            favoriteModal.classList.remove("active");
        }
    });

    document.addEventListener("click", function(event) {
        if (!event.target.classList.contains("favorite-button")) {
            return;
        }
        const currentUser = getCurrentUser();
        if (!currentUser) {
            alert("Сначала войдите в аккаунт");
            return;
        }
        const id = event.target.dataset.id;
        if (!favorites.includes(id)) {
            favorites.push(id);
            event.target.textContent = "Remove Favorite";
        } else {
            favorites = favorites.filter(function(item) {
                return item !== id;
            });
            event.target.textContent = "Favorite";
        }
        localStorage.setItem(
            "favorites_" + currentUser.login,
            JSON.stringify(favorites)
        );
    });
}
function renderFavorites() {
    const container = document.querySelector("#favoriteContainer");
    container.innerHTML = "";
    if (favorites.length === 0) {
        container.innerHTML = "<p>Favorite is empty</p>";
        return;
    }
    favorites.forEach(function(id) {
        const button = document.querySelector(
            '.favorite-button[data-id="' + id + '"]'
        );
        if (button) {
            const post = button.parentElement;
            container.append(post.cloneNode(true));
        }
    });
}