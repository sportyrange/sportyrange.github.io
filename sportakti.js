let startLayer = L.tileLayer.provider("BasemapAT.grau");

let map = L.map("map", {
    center: [47.265518, 11.397954],
    zoom: 13,
    layers: [
        startLayer
    ]
});