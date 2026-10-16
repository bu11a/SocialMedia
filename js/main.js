import { getPosts } from "./api.js";
import { renderPosts } from "./posts.js";
import { startFavorites } from "./favorites.js";
import { getCurrentUser, logout } from "./auth.js";

let allPosts = [];
let myPosts = JSON.parse(localStorage.getItem("myPosts") || "[]");

async function start() {
    const loader = document.querySelector("#loader");
    const authBtn = document.querySelector("#authBtn");
    const logoutBtn = document.querySelector("#logoutBtn");
    const searchInput = document.querySelector("#searchInput");
    const categoryFilter = document.querySelector("#categoryFilter");

    const addPostBtn = document.querySelector("#addPostBtn");
    const addPostModal = document.querySelector("#addPostModal");
    const closeAddPost = document.querySelector("#closeAddPost");
    const addPostForm = document.querySelector("#addPostForm");

    const user = getCurrentUser();

    if (user) {
        authBtn.style.display = "none";
        logoutBtn.style.display = "inline-flex";
    } else {
        authBtn.style.display = "inline-flex";
        logoutBtn.style.display = "none";
    }

    logoutBtn.addEventListener("click", function () {
        logout();
        window.location.reload();
    });

    startFavorites();

    addPostBtn.addEventListener("click", function () {
        if (!getCurrentUser()) {
            alert("Сначала войдите в аккаунт");
            return;
        }

        addPostModal.classList.add("active");
    });

    closeAddPost.addEventListener("click", function () {
        addPostModal.classList.remove("active");
    });

    addPostModal.addEventListener("click", function (event) {
        if (event.target === addPostModal) {
            addPostModal.classList.remove("active");
        }
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            addPostModal.classList.remove("active");
        }
    });

    addPostForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const currentUser = getCurrentUser();

        if (!currentUser) {
            alert("Сначала войдите в аккаунт");
            addPostModal.classList.remove("active");
            return;
        }

        const title = document.querySelector("#postTitle").value.trim();
        const description = document.querySelector("#postDescription").value.trim();
        const image = document.querySelector("#postImage").value.trim();
        const category = document.querySelector("#postCategory").value;

        if (!title || !description) {
            alert("Заполните заголовок и описание");
            return;
        }

        const newPost = {
            id: "custom-" + Date.now(),
            title: title,
            description: description,
            main_content: description,
            body: description,
            image: image,
            category: category,
            author: currentUser.login
        };

        myPosts.unshift(newPost);

        localStorage.setItem("myPosts", JSON.stringify(myPosts));

        allPosts = myPosts.concat(
            allPosts.filter(function (post) {
                return !String(post.id).startsWith("custom-");
            })
        );

        renderFilteredPosts();

        addPostForm.reset();
        addPostModal.classList.remove("active");

        alert("Публикация добавлена!");
    });

    document.addEventListener("click", function (event) {
        const button = event.target.closest(".not-interested-button");

        if (!button) {
            return;
        }

        const currentUser = getCurrentUser();

        if (!currentUser) {
            alert("Сначала войдите в аккаунт");
            return;
        }

        const id = String(button.dataset.id);
        const key = "hiddenPosts_" + currentUser.login;

        let hiddenPosts = JSON.parse(
            localStorage.getItem(key) || "[]"
        );

        if (!hiddenPosts.includes(id)) {
            hiddenPosts.push(id);
        }

        localStorage.setItem(key, JSON.stringify(hiddenPosts));

        renderFilteredPosts();
    });

    searchInput.addEventListener("input", function () {
        renderFilteredPosts();
    });

    categoryFilter.addEventListener("change", function () {
        renderFilteredPosts();
    });

    loader.style.display = "block";

    try {
        const apiPosts = await getPosts();

        allPosts = myPosts.concat(apiPosts);

        renderFilteredPosts();

        loader.style.display = "none";
    } catch (error) {
        console.log("Ошибка загрузки постов:", error);
        loader.textContent = "Ошибка загрузки постов";
    }
}

function getCategory(post, index) {
    if (post.category) {
        if (typeof post.category === "object") {
            return String(
                post.category.name ||
                post.category.title ||
                "other"
            ).toLowerCase();
        }

        return String(post.category).toLowerCase();
    }

    const title = (post.title || "").toLowerCase();

    const description = (
        post.description ||
        post.main_content ||
        post.body ||
        post.content ||
        ""
    ).toLowerCase();

    const text = title + " " + description;

    if (
        text.includes("game") ||
        text.includes("gaming") ||
        text.includes("игр") ||
        text.includes("playstation") ||
        text.includes("xbox") ||
        text.includes("minecraft")
    ) {
        return "games";
    }

    if (
        text.includes("tech") ||
        text.includes("computer") ||
        text.includes("software") ||
        text.includes("ai ") ||
        text.includes("technology") ||
        text.includes("технолог") ||
        text.includes("компьютер") ||
        text.includes("программ")
    ) {
        return "technology";
    }

    if (
        text.includes("life") ||
        text.includes("health") ||
        text.includes("food") ||
        text.includes("travel") ||
        text.includes("lifestyle") ||
        text.includes("жизн") ||
        text.includes("здоров") ||
        text.includes("путешеств")
    ) {
        return "lifestyle";
    }

    return "other";
}

function renderFilteredPosts() {
    const searchInput = document.querySelector("#searchInput");
    const categoryFilter = document.querySelector("#categoryFilter");

    const searchText = searchInput.value.toLowerCase().trim();
    const selectedCategory = categoryFilter.value.toLowerCase();

    const user = getCurrentUser();
    let hiddenPosts = [];

    if (user) {
        hiddenPosts = JSON.parse(
            localStorage.getItem("hiddenPosts_" + user.login) || "[]"
        );
    }

    const filteredPosts = allPosts.filter(function (post, index) {
        const postId = String(post.id);

        if (hiddenPosts.includes(postId)) {
            return false;
        }

        const title = (post.title || "").toLowerCase();

        const description = (
            post.description ||
            post.main_content ||
            post.body ||
            post.content ||
            ""
        ).toLowerCase();

        const matchesSearch =
            title.includes(searchText) ||
            description.includes(searchText);

        const category = getCategory(post, index);

        const matchesCategory =
            selectedCategory === "all" ||
            category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    renderPosts(filteredPosts);
}

start();