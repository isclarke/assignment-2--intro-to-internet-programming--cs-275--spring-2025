// Fetch the data from data.json
const fetchData = async () => {
    try {
        const response = await fetch(`json/data.json`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching JSON data:`, error);
    }
};

const initCarousel = async () => {
    const albums = await fetchData();
    if (albums) {
        const carouselSlides = document.querySelector(`.carousel-slides`);
        let index = 0;

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

            //Album title
            const albumTitle = document.createElement(`div`);
            albumTitle.classList.add(`album`);
            albumTitle.textContent = `${album.album}`;
            albumTitle.classList.add(`heading-style2`);

            //Album review
            const reviewPara = document.createElement(`p`);
            const strongText = document.createElement(`strong`);
            strongText.textContent = `Review: `;
            reviewPara.appendChild(strongText);
            reviewPara.appendChild(document.createTextNode(album.review.content));

            //Source
            const sourcePara = document.createElement(`p`);
            sourcePara.classList.add(`left-align`);
            const dash = document.createElement(`strong`);
            dash.textContent = `- `;
            const sourceLink = document.createElement(`a`);
            sourceLink.href = album.review.url;
            sourceLink.target = `_blank`;
            sourceLink.textContent = album.review.source;
            sourcePara.appendChild(dash);
            sourcePara.appendChild(sourceLink);
            sourceLink.classList.add(`no-underline`);

            //Artist name/visit link
            const visitLink = document.createElement(`header`);
            const visitAnchor = document.createElement(`a`);
            visitAnchor.href = album.url;
            visitAnchor.target = `_blank`;
            visitAnchor.textContent = `${album.artist}`;
            visitLink.appendChild(visitAnchor);
            visitAnchor.classList.add(`no-underline`);
            visitLink.classList.add(`heading-style`);

            //Credit link and name of creditee
            const creditLink = document.createElement(`header`);
            creditLink.textContent = `Credit: `;
            const creditAnchor = document.createElement(`a`);
            creditAnchor.href = album.cover_image.url;
            creditAnchor.target = `_blank`;
            creditAnchor.textContent = album.cover_image.credit;
            creditLink.appendChild(creditAnchor);
            creditAnchor.classList.add(`no-underline`);

            //Appending all items
            carouselItem.appendChild(albumTitle);
            carouselItem.appendChild(visitLink);
            carouselContent.appendChild(creditLink);
            carouselItem.appendChild(carouselImage);
            carouselItem.appendChild(carouselContent);
            carouselContent.appendChild(reviewPara);
            carouselContent.appendChild(sourcePara);
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
