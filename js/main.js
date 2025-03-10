// Fetch the data from data.json
const fetchData = async () => {
    try {
        const response = await fetch(`json/data.json`);  // Ensure this is correct for your setup
        const data = await response.json();
        return data; // Return the entire data object
    } catch (error) {
        console.error(`Error fetching JSON data:`, error);
    }
};

// Initialize the carousel
const initCarousel = async () => {
    const albums = await fetchData();
    if (albums) {
        const carouselSlides = document.querySelector(`.carousel-slides`);
        let index = 0; // Track the current slide

        // Populate carousel with albums
        albums.forEach((album, i) => {
            const carouselItem = document.createElement(`div`);
            carouselItem.classList.add(`carousel-item`);
            if (i === 0) {
                carouselItem.classList.add(`active`);
            }

            // Create and append the carousel image
            const carouselImage = document.createElement(`div`);
            carouselImage.classList.add(`carousel-image`);

            const img = document.createElement(`img`);

            img.src= album.cover_image.path;
            img.width = album.cover_image.width;
            img.height = album.cover_image.height;

            carouselImage.appendChild(img);

            // Create and append the carousel content
            const carouselContent = document.createElement(`div`);
            carouselContent.classList.add(`carousel-content`);


            const albumTitle = document.createElement(`div`);
            albumTitle.classList.add(`album`);
            albumTitle.textContent = `${album.album}`;

            const reviewPara = document.createElement(`p`);
            reviewPara.innerHTML = `<strong>Review:</strong> ${album.review.content}`;

            const sourcePara = document.createElement(`p`);
            sourcePara.classList.add(`left-align`);
            sourcePara.innerHTML = `<strong>-</strong> <a href="${album.review.url}"
            target="_blank">${album.review.source}</a>`;

            const visitLink = document.createElement(`header`);
            const visitAnchor = document.createElement(`a`);
            visitAnchor.href = album.url;
            visitAnchor.target = `_blank`;
            visitAnchor.textContent = `${album.artist}`;
            visitLink.appendChild(visitAnchor);

            // Append elements to carouselContent
            carouselItem.appendChild(albumTitle);
            carouselItem.appendChild(visitLink);
            carouselItem.appendChild(carouselImage);
            carouselItem.appendChild(carouselContent);
            carouselContent.appendChild(reviewPara);
            carouselContent.appendChild(sourcePara);

            // Add the complete carousel item to the carousel slides container
            carouselSlides.appendChild(carouselItem);

        });

        const updateSlide = () => {
            const items = document.querySelectorAll(`.carousel-item`);
            items.forEach((item, i) => {
                item.style.display = i === index ? `block` : `none`;
            });
        };

        // Nav's
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

        updateSlide();
    }
};

initCarousel();
