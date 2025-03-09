let loadJSONP = (url) => {
    let script = document.createElement(`script`);
    script.src = url;
    document.body.appendChild(script);
};

loadJSONP(`data.json`);

let currentIndex = 0;
let slides = [];

let updateSlides = () => {
    slides = document.querySelectorAll(`.slide`);
};

let showSlide = (index) => {
    slides.forEach((slide, i) => {
        slide.classList.toggle(`active`, i === index);
    });
};

document.querySelector(`#next`).addEventListener(`click`, () => {
    currentIndex = (currentIndex + 1) % slides.length;
    showSlide(currentIndex);
});

document.querySelector(`#prev`).addEventListener(`click`, () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    showSlide(currentIndex);
});

setTimeout(updateSlides, 1000);

// Assuming loadJSONP should call a callback function with data, you can define it like so:
let loadJSONPWithCallback = (url, callback) => {
    let script = document.createElement(`script`);
    script.src = url;
    script.onload = () => {
        // Assuming the data comes from the JSONP request as a global variable
        callback(window.jsonData); // Replace `window.jsonData` with actual data
    };
    document.body.appendChild(script);
};

// Usage with callback
loadJSONPWithCallback(`data.json`, (data) => {
    let carousel = document.querySelector(`#carousel`);

    data.forEach((item, index) => {
        let slide = document.createElement(`div`);
        slide.classList.add(`slide`);
        if (index === 0) slide.classList.add(`active`);

        let slideHTML = `
            <img src="${item.cover_image.path}"
                 alt="${item.cover_image.alt_content}"
                 width="${item.cover_image.width}"
                 height="${item.cover_image.height}">
            <h2>${item.artist} - ${item.album}</h2>
            <p><a href="${item.url}" target="_blank">More Info</a></p>
        `;

        slide.innerHTML = slideHTML;
        carousel.appendChild(slide);
    });
});
