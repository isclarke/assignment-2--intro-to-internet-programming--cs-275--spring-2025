// -----------------------------------------------------------------------------
// This file includes deliberate formatting errors in order for you to verify
// that ESLint and EditorConfig are working properly. If both tools are, indeed,
// working correctly, then you’d see errors in your editor about indentation and
// improper use of footmarks instead of back ticks. When you save this file,
// your editor should strip all excess newlines and whitespace characters from
// the file. If both of these events occur, then ESLint and EditorConfig are
// working correctly.
//
// DON’T PROCEED UNTIL YOU’RE SURE ESLINT AND EDITORCONFIG ARE WORKING CORRECTLY
// -----------------------------------------------------------------------------
let loadJSONP = (url) => {
    let script = document.createElement('script');
    script.src = url;
    document.body.appendChild(script);
};

// Callback function
let callback = (data) => {
    let carousel = document.querySelector('#carousel');

    data.forEach((item, index) => {
        let slide = document.createElement('div');
        slide.classList.add('slide');
        if (index === 0) slide.classList.add('active');

        slide.innerHTML = `
            <img src="${item.cover_image.path}" alt="${item.cover_image.alt_content}" width="${item.cover_image.width}" height="${item.cover_image.height}">
            <h2>${item.artist} - ${item.album}</h2>
            <p><a href="${item.url}" target="_blank">More Info</a></p>
        `;

        carousel.appendChild(slide);
    });
};

loadJSONP('data.json');

let currentIndex = 0;
let slides = [];

let updateSlides = () => {
    slides = document.querySelectorAll('.slide');
};
