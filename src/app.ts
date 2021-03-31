import * as L from "leaflet";
import "leaflet-imageoverlay-rotated";

const enum EventName {
    LOAD = "load",
    CLICK = "click",
    MOUSE_MOVE = "mousemove",
    INPUT = "input"
}

let input_deg: HTMLInputElement = <HTMLInputElement>document.getElementById("deg");

window.addEventListener(EventName.INPUT, e => {
    let display_deg: HTMLInputElement = <HTMLInputElement>document.getElementById("display_deg");
    display_deg.innerHTML = input_deg.value
    let display_ever_given: HTMLInputElement = <HTMLInputElement>document.getElementById("display_ever_given");
    display_ever_given.style.transform = "rotate(" + Number(input_deg.value) + "deg)";
});

const button_delete_all = document.getElementById("delete_all")!;
button_delete_all.addEventListener(EventName.CLICK, () => clear_ever_given(true));
const button_delete = document.getElementById("delete")!;
button_delete.addEventListener(EventName.CLICK, () => clear_ever_given(false));

// Map
const std_map = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png', { attribution: "<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>地理院タイル</a>" }),
    seamlessphoto_map = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg', { attribution: "<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>地理院タイル</a>" }),
    os_map = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: "Map data © <a href='https://www.openstreetmap.org/copyright' target='_blank'>OpenStreetMap</a> contributors" });

let map = L.map("map", {
    center: [35.7140371, 139.7925173],
    zoom: 14,
    layers: [std_map, seamlessphoto_map, os_map]
});

const myMaps = {
    "地理院地図 標準": std_map,
    "地理院地図 写真": seamlessphoto_map,
    "OpenStreetMap": os_map,
};

L.control.layers(myMaps).addTo(map);

let ever_givens: L.ImageOverlay[] = [];

// 地図上を左クリックで設置
map.on("click", function (e: any) {
    console.log(e.latlng.lat, e.latlng.lng);
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;
    input_deg = <HTMLInputElement>document.getElementById("deg");

    const deg = Number(input_deg.value) - 135;//360 * Math.random();
    const rad = deg * (Math.PI / 180);
    const r = 0.00265;

    const topleft = L.latLng(lat + r * Math.cos(rad), lng + r * Math.sin(rad)),
        topright = L.latLng(lat + r * Math.cos(rad - Math.PI / 2), lng + r * Math.sin(rad - Math.PI / 2)),
        bottomleft = L.latLng(lat + r * Math.cos(rad + Math.PI / 2), lng + r * Math.sin(rad + Math.PI / 2))

    const ever_given = L.imageOverlay.rotated("./img/ever_given.png", topleft, topright, bottomleft, {
        opacity: 1,
        interactive: true,
        attribution: ""
    }).addTo(map);

    ever_givens.push(ever_given);
});

function clear_ever_given(all: boolean) {
    if (all) {
        for (let ever_given of ever_givens) {
            map.removeLayer(ever_given);
        }
    } else {
        for (let ever_given of ever_givens.reverse()) {
            if (map.hasLayer(ever_given)) {
                map.removeLayer(ever_given);
                break;
            }
        }

    }
}