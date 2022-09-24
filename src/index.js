var colors = [];
generate_initial_colors();
var key_events = {
    'n': () => {
        if (colors.length < 10) {
            let color = new_color();
            let color_box = new_color_box(color);
            colors.push({color: color, liked: false});
            document
                .getElementById('palette')
                .appendChild(color_box);
        }
    },
    'e': () => {
        let liked_colors = colors.filter((c) => c.liked);
        if (liked_colors.length > 0) {
            copy(liked_colors.map((c) => color2hex(c.color)).join(' '));
        }
    },
    'g': () => {
        generate_new_colors();
    }
};

document.addEventListener('keydown', function (event) {
    if (event.key in key_events) {
        key_events[event.key]();
    }
});

/** 
 * Returns the luminance value of a color.
 * @param {Array} color The color to calculate the luminance of in [R, G, B] 255bit values.
 * @returns {Number} The luminance value of the color.
 */
function luminance(color) {
    return 0.2126*color[0] + 0.7152*color[1] + 0.0722*color[2];
}

/**
 * Creates a span element with a material-icon heart icon inside it and returns it.
 * @returns {HTMLSpanElement} The heart icon.
 */
function new_heart_icon() {
    let heart = document
    .createElement('span');
    heart.classList
    .add('material-icons');
    heart.classList
    .add('heart');
    heart.innerText = 'favorite_border';
    return heart;
}

/**
 * Creates a new button with a material-icon heart icon inside it and returns it.
 * @param {Array} color The color for the color box that the heart button is for. In [R, G, B] 255bit values.
 * @returns {HTMLButtonElement} The heart button.
 */
function new_heart_button(color) {
    let heart = new_heart_icon();
    let heart_button = document
        .createElement('button');
    heart_button.classList
        .add('heart-button');
    heart_button.appendChild(heart);
    heart_button.addEventListener('click', () => {
        if (heart.innerText === 'favorite_border') {
            heart.innerText = 'favorite';
        } 
        else {
            heart.innerText = 'favorite_border';
        }
        let selected_color = colors.find((c) => c.color === color);
        selected_color.liked = !selected_color.liked;
    });
    
    let lum = luminance(color);
    if (lum > 128) {
        heart.style.color = 'black';
    }
    
    return heart_button;
}

/**
 * Creates a span element with a material-icon delete icon inside it and returns it.
 * @returns {HTMLSpanElement} The delete icon.
 */
function new_delete_icon() {
    let trash = document
        .createElement('span');
    trash.classList
        .add('material-icons');
    trash.classList
        .add('delete');
    trash.innerText = 'delete';
    return trash;
}

/**
 * Creates a button element with a material-icon delete icon inside it and returns it.
 * @param {Array} color The color for the color box that the delete button is for. In [R, G, B] 255bit values.
 * @returns {HTMLButtonElement} The delete button.
 */
function new_delete_button(color) {
    let delete_icon = new_delete_icon();
    let delete_button = document
        .createElement('button');
    delete_button.classList
        .add('delete-button');
    delete_button.appendChild(delete_icon);
    delete_button.addEventListener('click', () => {
        let color_box = document.getElementById(color2hex(color));
        color_box.remove();
        colors = colors.filter((c) => c.color !== color);
    });
    
    let lum = luminance(color);
    if (lum > 128) {
        delete_icon.style.color = 'black';
    }
    return delete_button;
}

/**
 * Creates a new button with the hex value of the of @param color inside it as text. 
 * @param {Array} color The color for the color box that the hex button is for. In [R, G, B] 255bit values.
 * @returns {HTMLButtonElement} The hex button.
 */
function new_hex_color_button(color) {
    let hex_color_button = document
        .createElement('button');
    hex_color_button.classList
        .add('hex-color-button');
    let color_hex = color2hex(color);
    hex_color_button.innerText = color_hex;
    hex_color_button.style.backgroundColor = `rgba(${color[0] * 1/2}, ${color[1] * 1/2}, ${color[2] * 1/2}, 0.5)`;
    hex_color_button.addEventListener('click', () => {
        copy(color_hex);
    });
    let lum = luminance(color);
    if (lum > 128) {
        hex_color_button.style.color = 'black';
    }
    return hex_color_button;
}


/**
 * Creates a new div with the hex button, the heart button and the delete button inside it and returns it.
 * @param {Array} color The color for the color box that the action column is for. In [R, G, B] 255bit values.
 * @returns {HTMLDivElement} The action column.
 */
function new_color_box_action_column(color) {
    let color_box_action_column = document
        .createElement('div');
    color_box_action_column.classList
        .add('color-box-action-column');
    let hex_color_button = new_hex_color_button(color);
    let heart_button = new_heart_button(color);
    let delete_button = new_delete_button(color);
    color_box_action_column
        .appendChild(hex_color_button);
    color_box_action_column
        .appendChild(heart_button);
    color_box_action_column
        .appendChild(delete_button);
    return color_box_action_column;
}

/**
 * Converts a color from [R, G, B] 255bit values to a hex value in the format #RRGGBB inside a string.
 * @param {Array} color The color to convert to hex. In [R, G, B] 255bit values. 
 * @returns {String} The hex value of the color.
 */
function color2hex(color) {
    return `#${dec2hex(color[0])}${dec2hex(color[1])}${dec2hex(color[2])}`
}

/**
 * Creates a new div with the action column and the @param color as background color inside it and returns it.
 * @param {Array} color The color for the background of the color box. In [R, G, B] 255bit values.
 * @returns {HTMLDivElement} The color box.
 */
function new_color_box(color)
{
    let color_box_action_column = new_color_box_action_column(color);
    let color_box = document
        .createElement('div');
    color_box.classList
        .add('color-box');
    color_box.id = color2hex(color);
    color_box.style.backgroundColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
    color_box
        .appendChild(color_box_action_column);
    return color_box;
}

/**
 * Programmatically creates 4 colors and color boxes for them and adds them to the dom.
 * @returns {void}
 */
function generate_initial_colors() {
    for (let i = 0; i < 4; i++) {
        let color = new_color();
        let color_box = new_color_box(color);
        colors.push({color: color, liked: false});
        document
            .getElementById('palette')
            .appendChild(color_box);
    }
}

/**
 * Replaces the color box with the id of @param color with @param forColor color.
 * @param {Array} color The color to replace the color box with. In [R, G, B] 255bit values.
 * @param {Array} for_color The color to replace the color box for. In [R, G, B] 255bit values.
 */
function replace_color_box(color, for_color) {
    let color_box = document.getElementById(color2hex(color));
    if (color_box) {
        color_box.replaceWith(new_color_box(for_color));
    }
}

/**
 * Generates new color boxes for the color boxes that are not liked in the palette and replaces them.
 * @returns {void}
 */
function generate_new_colors() {
    let not_liked_colors = colors.filter((c) => c.liked === false);
    not_liked_colors.forEach((c) => {
        let old_color = c.color;
        c.color = new_color();
        replace_color_box(old_color, c.color);
        colors = colors.filter((c) => c.color !== old_color);
    })
}

/**
 * Copies the @param text to the clipboard.
 * @param {string} text The text to copy to the clipboard. 
 */
function copy(text) {
    navigator.clipboard.writeText(text);
}

/**
 * Converts a decimal number to a hex number.
 * @param {number} decimal the number in decimal to convert to hex.
 * @returns {string} The number in hex.
 */
function dec2hex(decimal) {
    return decimal.toString(16).padStart(2, '0').toUpperCase();
}

/**
 * Generates a random number from @param min to @param max.
 * @param {number} start The minimum number to generate.
 * @param {number} end The maximum number to generate.
 * @returns {number} The random number.
 */
function generate_random_number_from_range(start, end) {
    return Math.floor(Math.random() * (end - start + 1)) + start;
}

/**
 * Generates a random color in [R, G, B] 255bit values.
 * @returns {Array} The random color in [R, G, B] 255bit values.
 */
function new_color() {
    // TODO: Make a better color generator. non-montecarlo algorithm.
    let color = [
        generate_random_number_from_range(0, 255),
        generate_random_number_from_range(0, 255), 
        generate_random_number_from_range(0, 255)
    ];
    while (colors.find((c) => c === color)) {
        color = [
            generate_random_number_from_range(0, 255), 
            generate_random_number_from_range(0, 255),
            generate_random_number_from_range(0, 255)
        ];
    }
    return color;
}


