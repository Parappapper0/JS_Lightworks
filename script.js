const sleep = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms));
const MAXLIGHT = 255; //DO NOT EDIT
let ever = true;
let cursor_interval;
let cursor_position = { x: -1, y: -1 };
let center_copy = { x: -1, y: -1 };
let fading_gradient;

const source_strength = 500;
let center = { x: 35, y: 20 };
const resolution = { x: 100, y: 100 };
let color_mask = { r: 155, g: 0, b: 255 };
const fading_gradient_modifier = 1;

////////////////////////////////////////////
fading_gradient = source_strength * fading_gradient_modifier / 255;

let table = document.createElement("table");
table.cellSpacing = 0;

for (let j = 0; j < resolution.y; j++) {

    let tr = document.createElement("tr");
    for (let i = 0; i < resolution.x; i++) {

        let td = document.createElement("td");

        let light = calcColor(i, j);
        setColor(td, light);

        td.style.width = (100 / resolution) + "%";
        td.style.height = (100 / resolution) + "%";
        td.className = i + " " + j;
        td.addEventListener("mouseover", setCursorPosition);

        tr.appendChild(td);
    }
    table.appendChild(tr);
}

document.getElementsByTagName("body")[0].appendChild(table);

setInterval(reloadColors, 17);

////////////////////////////////////////////

function calcColor(i, j) {

    let light;
    if (i == center.x && j == center.y) light = source_strength;
    else {
        light = source_strength / Math.sqrt(Math.pow(i - center.x, 2) + Math.pow(j - center.y, 2)) + fading_gradient / Math.pow(Math.pow(i - center.x, 2) + Math.pow(j - center.y, 2), 0.05);
        if (light > source_strength) light = source_strength
    }

    if (light > MAXLIGHT) light = MAXLIGHT;
    return light;
}

function setColor(td, light) {

    td.style.backgroundColor = "rgb(" +
        light * color_mask.r / 255 + ", " +
        light * color_mask.g / 255 + ", " +
        light * color_mask.b / 255 + ")";
}

function reloadColors() {

    for (let j = 0; j < resolution.y; j++)
        for (let i = 0; i < resolution.x; i++)
            setColor(document.getElementsByTagName("td")[j * resolution.x + i], calcColor(i, j));
}

async function rgb(enable = true) {

    if (enable) {

        let old_mask = color_mask;
        color_mask = { r: 255, g: 0, b: 0 };
        for (; ever;) {
            for (; color_mask.g < 255 && ever; color_mask.g++) { await sleep(1); }
            for (; color_mask.r >= 0 && ever; color_mask.r--) { await sleep(1); }
            for (; color_mask.b < 255 && ever; color_mask.b++) { await sleep(1); }
            for (; color_mask.g >= 0 && ever; color_mask.g--) { await sleep(1); }
            for (; color_mask.r < 255 && ever; color_mask.r++) { await sleep(1); }
            for (; color_mask.b >= 0 && ever; color_mask.b--) { await sleep(1); }
        }
        ever = true;
        color_mask = old_mask;
    }
    else {
        ever = false;
    }
}

function setCursorPosition(event) {

    cursor_position.x = event.target.classList[0]; cursor_position.y = event.target.classList[1];
}

function followCursor(enable = true) {

    if (enable) {
        center_copy.x = center.x;
        center_copy.y = center.y;

        cursor_interval = setInterval(() => {

            if (center.x != cursor_position.x || center.y != cursor_position.y) {

                center.x = cursor_position.x;
                center.y = cursor_position.y;

                for (let j = 0; j < resolution.y; j++)
                    for (let i = 0; i < resolution.x; i++)
                        setColor(document.getElementsByTagName("td")[j * resolution.x + i], calcColor(i, j));
            }
        }, 5);
    }
    else {
        clearInterval(cursor_interval);
        center.x = center_copy.x;
        center.y = center_copy.y;
    }
}