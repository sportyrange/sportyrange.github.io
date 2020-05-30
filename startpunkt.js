/*
const searchControl = new GeoSearchControl({
  provider: "OpenStreetMap.Mapnik",
});

const map = new L.map('searchMap');
map.addControl(searchControl);
*/

let map = L.map("searchMap", {
  center: [47.263353, 11.400533],
  zoom: 13,
  layers: [L.tileLayer.provider('OpenStreetMap.DE')]
});

/*
map.addControl(searchControl);

new GeoSearchControl({
    provider: "OpenStreetMap.Mapnik", // required
    style: 'bar', // optional: bar|button  - default button
}).addTo(map);

map.addControl(searchControl);
*/