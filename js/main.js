const fetchData = async () => {
    try {
        const response = await fetch(`json/data.json`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching JSON data:`, error);
    }
};

const createCarousel = async () => {
    const albums = await fetchData();
    if (albums) {
        const carouselSlides = document.querySelector(`.carousel-slides`);
        let index = 0;

        // Add albums to carousel items
        albums.forEach((album, i) => {
            const carouselItem = document.createElement(`div`);
            carouselItem.classList.add(`carousel-item`);
            if (i === 0) {
                carouselItem.classList.add(`active`);
            }

            // Create and add the images to the carousel
            const carouselImage = document.createElement(`div`);
            carouselImage.classList.add(`carousel-image`);

            const img = document.createElement(`img`);
            img.src = album.cover_image.path;
            // Read width and height from data.json
            img.width = album.cover_image.width;
            img.height = album.cover_image.height;
            carouselImage.appendChild(img);

            // Create and add carousel content
            const carouselContent = document.createElement(`div`);
            carouselContent.classList.add(`carousel-content`);

            // Album title
            const albumTitle = document.createElement(`div`);
            albumTitle.classList.add(`album`, `heading-style2`);
            albumTitle.textContent = `${album.album}`;

            // Album review
            const reviewPara = document.createElement(`p`);
            reviewPara.textContent = album.review.content;

            // Source
            const sourcePara = document.createElement(`p`);
            sourcePara.classList.add(`left-align`);
            const dash = document.createElement(`strong`);
            dash.textContent = `- `;
            const sourceLink = document.createElement(`a`);
            sourceLink.href = album.review.url;
            sourceLink.target = `_blank`;
            sourceLink.textContent = album.review.source;
            sourceLink.classList.add(`no-underline`);
            sourcePara.append(dash, sourceLink);

            // Artist name and visit link
            const visitLink = document.createElement(`header`);
            const visitAnchor = document.createElement(`a`);
            visitAnchor.href = album.url;
            visitAnchor.target = `_blank`;
            visitAnchor.textContent = `${album.artist}`;
            visitAnchor.classList.add(`no-underline`);
            visitLink.classList.add(`heading-style`);
            visitLink.appendChild(visitAnchor);

            // Credit link and name of creditee
            const creditLink = document.createElement(`header`);
            creditLink.textContent = `Credit: `;
            const creditAnchor = document.createElement(`a`);
            creditAnchor.href = album.cover_image.url;
            creditAnchor.target = `_blank`;
            creditAnchor.textContent = album.cover_image.credit;
            creditAnchor.classList.add(`no-underline`);
            creditLink.appendChild(creditAnchor);

            // Appending all items
            carouselItem.append(albumTitle, visitLink, carouselImage, carouselContent);
            carouselContent.append(reviewPara, sourcePara, creditLink);
            carouselSlides.appendChild(carouselItem);
        });

        // Update slides, only show one image at a time
        const updateSlide = () => {
            const items = document.querySelectorAll(`.carousel-item`);
            items.forEach((item, i) => {
                item.style.display = i === index ? `block` : `none`;
            });
        };

        // Navigation buttons
        const leftButton = document.querySelector(`.carousel-navigation a:first-child`);
        const nextBtn = document.querySelector(`.carousel-navigation a:last-child`);

        nextBtn.addEventListener(`click`, (e) => {
            e.preventDefault();
            index = (index + 1) % albums.length;
            updateSlide();
        });

        leftButton.addEventListener(`click`, (e) => {
            e.preventDefault();
            index = (index - 1 + albums.length) % albums.length;
            updateSlide();
        });

        updateSlide();
    }
};

// Call the function
createCarousel();
