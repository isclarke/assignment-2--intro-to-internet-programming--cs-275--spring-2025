// Fetch the data from data.json
const fetchData = async () => {
    try {
        const response = await fetch(`json/data.json`);
        const data = await response.json();
        return data; // Return the entire data object
    } catch (error) {
        console.error(`Error fetching JSON data:`, error);
    }
};

// Create the carousel
const createCarousel = (albums) => {
    const carouselSlides = document.querySelector(`.carousel-slides`);
    let index = 0; // Track the current slide

    // Populate carousel with albums
    albums.forEach((album, i) => {
        const carouselItem = document.createElement(`div`);
        carouselItem.className = `carousel-item ${i === 0 ? `active` : ``}`;

        carouselItem.innerHTML = `
            <img src="${album.cover_image.path}"
                 alt="${album.cover_image.alt_content}"
                 width="${album.cover_image.width}"
                 height="${album.cover_image.height}">
            <h2>${album.artist} - ${album.album}</h2>
            <p>${album.review.content}</p>
            <a href="${album.url}" target="_blank">Visit Artist</a>
            <a href="${album.review.url}" target="_blank">Read Review</a>
        `;

        carouselSlides.appendChild(carouselItem);
    });

    // Function to update active slide
    const updateSlide = () => {
        const items = document.querySelectorAll(`.carousel-item`);
        items.forEach((item, i) => {
            item.style.display = i === index ? `block` : `none`;
        });
    };

    // Navigation controls
    const prevBtn = document.querySelector(`.carousel-navigation a:first-child`);
    const nextBtn = document.querySelector(`.carousel-navigation a:last-child`);

    nextBtn.addEventListener(`click`, (e) => {
        e.preventDefault();
        index = (index + 1) % albums.length;
        updateSlide();
    });

    prevBtn.addEventListener(`click`, (e) => {
        e.preventDefault();
        index = (index - 1 + albums.length) % albums.length;
        updateSlide();
    });

    updateSlide(); // Set initial slide
};

// Initialize the carousel
const initCarousel = async () => {
    const data = await fetchData();
    if (data) {
        createCarousel(data);
    }
};

// Call the initialization function
initCarousel();
