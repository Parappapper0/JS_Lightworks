const sleep = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms));
const MAXLIGHT = 255; //DO NOT EDIT
let ever = true;

const source_strength = 300;
const center = { x: 35, y: 20 };
const resolution = { x: 51, y: 51 }; //has to be odd
let color_mask = { r: 155, g: 0, b: 255 };

////////////////////////////////////////////
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

        tr.appendChild(td);
    }
    table.appendChild(tr);
}

document.getElementsByTagName("body")[0].appendChild(table);

////////////////////////////////////////////
function calcColor(i, j) {

    let light;
    if (i == center.x && j == center.y) light = source_strength;
    else light = source_strength / Math.sqrt(Math.pow(i - center.x, 2) + Math.pow(j - center.y, 2));

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

        color_mask = { r: 255, g: 0, b: 0 };
        for (; ever;) {
            for (; color_mask.g < 255; color_mask.g++) { await sleep(0); reloadColors(); }
            for (; color_mask.r >= 0; color_mask.r--) { await sleep(0); reloadColors(); }
            for (; color_mask.b < 255; color_mask.b++) { await sleep(0); reloadColors(); }
            for (; color_mask.g >= 0; color_mask.g--) { await sleep(0); reloadColors(); }
            for (; color_mask.r < 255; color_mask.r++) { await sleep(0); reloadColors(); }
            for (; color_mask.b >= 0; color_mask.b--) { await sleep(0); reloadColors(); }
        }
        ever = true;
    }
    else {
        ever = false;
    }
}