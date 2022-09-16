var colors = [];
generate_initial_colors();

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
    
    let luminance = 0.2126*color[0] + 0.7152*color[1] + 0.0722*color[2];
    if (luminance > 128) {
        delete_icon.style.color = 'black';
    }
    return delete_button;
}

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
    let luminance = 0.2126*color[0] + 0.7152*color[1] + 0.0722*color[2];
    if (luminance > 128) {
        hex_color_button.style.color = 'black';
    }
    return hex_color_button;
}

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
        else
        {
            heart.innerText = 'favorite_border';
        }
        let selected_color = colors.find((c) => c.color === color);
        selected_color.liked = !selected_color.liked;
    });
    
    let luminance = 0.2126*color[0] + 0.7152*color[1] + 0.0722*color[2];
    if (luminance > 128) {
        heart.style.color = 'black';
    }
    
    return heart_button;
}

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

function color2hex(color) {
    return `#${dec2hex(color[0])}${dec2hex(color[1])}${dec2hex(color[2])}`
}

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
    colors.push({'color': color, 'liked': false});
    return color_box;
}
function generate_initial_colors() {
    for (let i = 0; i < 4; i++) {
        let color = new_color();
        let color_box = new_color_box(color);
        document
            .getElementById('palette')
            .appendChild(color_box);
    }
}

function replace_color_box(color, forColor) {
    let color_box = document.getElementById(color2hex(color));
    if (color_box) {
        color_box.replaceWith(new_color_box(forColor));
    }
}

function generate_new_colors() {
    let not_liked_colors = colors.filter((c) => !c.liked);
    not_liked_colors.forEach((c) => {
        let old_color = c.color;
        c.color = new_color();
        debugger;
        replace_color_box(old_color, c.color);
    })

}
function new_color() {
    let color = [
        generateRandomNumberFromRange(0, 255),
        generateRandomNumberFromRange(0, 255), 
        generateRandomNumberFromRange(0, 255)
    ];
    while (colors.find((c) => c === color)) {
        color = [
            generateRandomNumberFromRange(0, 255), 
            generateRandomNumberFromRange(0, 255),
            generateRandomNumberFromRange(0, 255)
        ];
    }
    return color;
}
var key_events = {
    'n': () => {
        if (colors.length < 10) {
            let color_box = new_color_box(new_color());
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

function copy(text) {
    navigator.clipboard.writeText(text);
}

function dec2hex(decimal) {
    return decimal.toString(16).padStart(2, '0').toUpperCase();
}

function generateRandomNumberFromRange(start, end) {
    return Math.floor(Math.random() * (end - start + 1)) + start;
}

document.addEventListener('keydown', function (event) {
    if (event.key in key_events) {
        key_events[event.key]();
    }
    console.warn(event.key);
});

