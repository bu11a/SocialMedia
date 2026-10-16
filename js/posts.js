export function renderPosts(posts) {
    const postsContainer = document.querySelector("#postsContainer");

    postsContainer.innerHTML = "";

    posts.forEach(function (post) {
        const postElement = document.createElement("div");

        postElement.className = "post";

        const image = post.image || (post.user && post.user.profile_pic) || "";
        const description = post.description || post.main_content || post.body || "";
        const author = post.author || (post.user && post.user.name) || "Unknown";

        postElement.innerHTML = `
            ${image ? `
                <img
                    src="${image}"
                    alt="${post.title || "Post image"}"
                    class="post-image"
                >
            ` : ""}

            <h3>${post.title || "Untitled"}</h3>

            <p>${description}</p>

            <p class="post-author">Автор: ${author}</p>


            <button class="favorite-button" data-id="${post.id}">
                Favorite
            </button>

            <button class="not-interested-button" data-id="${post.id}">
                Not interested
            </button>

        `;

        postsContainer.append(postElement);
    });

    const images = document.querySelectorAll(".post-image");

    images.forEach(function (image) {
        image.addEventListener("click", function () {
            const imageModal = document.createElement("div");

            imageModal.className = "image-modal";

            imageModal.innerHTML = `
                <div class="image-modal-content">
                    <button class="close-image">×</button>
                    <img src="${image.src}" alt="${image.alt}">
                </div>
            `;

            document.body.append(imageModal);

            imageModal.querySelector(".close-image").addEventListener("click", function () {
                imageModal.remove();
            });

            imageModal.addEventListener("click", function (event) {
                if (event.target === imageModal) {
                    imageModal.remove();
                }
            });

            document.addEventListener("keydown", function closeOnEscape(event) {
                if (event.key === "Escape") {
                    imageModal.remove();
                    document.removeEventListener("keydown", closeOnEscape);
                }
            });
        });
    });
}