export async function getPosts() {
    const response = await fetch("https://jsonfakery.com/blogs?limit=100");
    const data = await response.json();

    return data;
}