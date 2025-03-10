const fetchData = async () => {
    const response = await fetch(`data.json`);
    const data = await response.json();
    return data.albums; // Adjusted to match the new structure
};

// Create the carousel
const createCarousel = (albums) => {
    const carouselContainer = document.getElementById(`carousel`);

    albums.forEach((album) => {
        const carouselItem = document.createElement(`div`);
        carouselItem.className = `carousel-item`;

        const imgElement = `
            <img src="${album.cover_image.path}"
                 alt="${album.cover_image.alt_content}"
                 width="${album.cover_image.width}"
                 height="${album.cover_image.height}">
        `;

        const titleElement = `
            <h2>${album.artist} - ${album.album}</h2>
        `;

        const reviewElement = `
            <p>${album.review.content}</p>
        `;

        const linksElement = `
            <a href="${album.url}">Visit Artist</a>
            <a href="${album.review.url}">Read Review</a>
        `;

        carouselItem.innerHTML = imgElement + titleElement + reviewElement + linksElement;

        carouselContainer.appendChild(carouselItem);
    });
};

// Initialize the carousel
const initCarousel = async () => {
    const albums = await fetchData();
    createCarousel(albums);
};

// Call the initialization function
initCarousel();
