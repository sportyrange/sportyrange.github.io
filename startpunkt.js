/*
const searchControl = new GeoSearchControl({
  provider: "OpenStreetMap.Mapnik",
});

const map = new L.map('searchMap');
map.addControl(searchControl);
*/

let map = L.map("searchMap", {
    center: [47.3, 11.5],
    zoom: 10,
    layers: [L.tileLayer.provider('BasemapAT.grau')]
});

/*
map.addControl(searchControl);

new GeoSearchControl({
    provider: "OpenStreetMap.Mapnik", // required
    style: 'bar', // optional: bar|button  - default button
}).addTo(map);

map.addControl(searchControl);
*/