export function renderPosts(posts) {
    const postsContainer = document.querySelector("#postsContainer");

    postsContainer.innerHTML = "";
    console.log(posts)
    posts.forEach(function(post) {
        const postElement = document.createElement("div");

        postElement.className = "post";

        postElement.innerHTML = `
            <img
                src="${post.user.profile_pic}"
                alt="${post.title}"
                class="post-image"
            >

            <h3>${post.title}</h3>

            ${post.main_content}

            <button class="favorite-button" data-id="${post.id}">
                Favorite
            </button>
        `;

        postsContainer.append(postElement);
    });

    const images = document.querySelectorAll(".post-image");
    console.log(images)
    images.forEach(function(image) {
        image.addEventListener("click", function() {
            const imageModal = document.createElement("div");

            imageModal.className = "image-modal";

            imageModal.innerHTML = `
                <div class="image-modal-content">
                    <button class="close-image">×</button>
                    <img src="${image.src}" alt="${image.alt}">
                </div>
            `;

            document.body.append(imageModal);

            imageModal.querySelector(".close-image").addEventListener("click", function() {
                imageModal.remove();
            });

            imageModal.addEventListener("click", function(event) {
                if (event.target === imageModal) {
                    imageModal.remove();
                }
            });
        });
    });
}