//Karten Zentrierung und Zoom Level
let map = L.map("searchMap").setView([47.263353, 11.400533], 13);

// Create a Leaflet tile layer object
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

//#Geocoder#############################################################################################
//Esri Leaflet Geocoder
var searchControl = L.esri.Geocoding.geosearch().addTo(map);

var results = L.layerGroup().addTo(map);
//Geocoder minimal
searchControl.on('results', function (data) {
  results.clearLayers();
  for (var i = data.results.length - 1; i >= 0; i--) {
    results.addLayer(L.marker(data.results[i].latlng));
  }
});

//#reachability#############################################################################################^
// Function to style the reachability polygons
function styleIsolines(feature) {
  return {
    color: '#ff0000',
    opacity: 0.5,
    fillOpacity: 0.2
  };
}

//Initialise the reachability plugin
L.control.reachability({
  //apiKey generated from openrouteservice 
  apiKey: '5b3ce3597851110001cf6248e8d4399d1f9c44fdb1e954b00f3c703f',
  expandButtonContent: '',
  expandButtonStyleClass: 'reachability-control-expand-button fa fa-map-marker',
  //reachability polygons
  styleFn: styleIsolines
}).addTo(map);