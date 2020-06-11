//Karten Zentrierung und Zoom Level
let map = L.map("searchMap").setView([47.263353, 11.400533], 13);

// Create a Leaflet tile layer object
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);



//#reachability#############################################################################################
// Function to return a colour based on the 'Range' value of the reachability polygons
function getColourByRange(value) {
  switch (value) {
    case 5:
      return '#5EFF33'; 
    case 10:
      return '#00B608';
    case 15:
      return '#00B687';
    case 20:
      return '#E1E70D';
    case 25:
      return '#E7870D';
    default:
      return '#EE0E0E'
  }
}



// Function to style the reachability polygons
function styleIsolines(feature) {
  // Get the value of the range property of the feature
  let rangeVal = feature.properties['Range'];
  // If the range is based on distance, multiply the value by 10 to match the time range values
  if (feature.properties['Measure'] == 'distance') rangeVal = rangeVal * 10;

  return {
    color: getColourByRange(rangeVal),
    opacity: 0.5,
    fillOpacity: 0.2
  };
}

//Polygon Popup
// Listen for the event fired when reachability areas are created on the map
map.on('reachability:displayed', function (e) {
  let properties,
    content;

  // Iterate through the reachability polygons just created, binding a popup to each one
  reachabilityControl.latestIsolines.eachLayer(function (layer) {
    // Ensure we only bind popups to the polygons and not the origin marker
    // Marker layers don't have the 'feature' property
    if (layer.hasOwnProperty('feature')) {
      properties = layer.feature.properties;
      content = 'Erreichbar in 0 - ' + properties['Range'] + ' ' + properties['Range units'] + '<br />basierend auf ' + properties['Travel mode'] + ' profil';
      layer.bindPopup(content);
    }
  });
});



//Initialise the reachability plugin
let reachabilityControl = L.control.reachability({
  //apiKey generated from openrouteservice 
  apiKey: '5b3ce3597851110001cf6248e8d4399d1f9c44fdb1e954b00f3c703f',
  //expand button as icon from: Font Awesome 4.7.0 icons
  expandButtonContent: '',
  expandButtonStyleClass: 'reachability-control-expand-button fa fa-map-marker',
  //reachability polygons
  styleFn: styleIsolines,
  //draw and delete buttons
  drawButtonContent: '',
  drawButtonStyleClass: 'fa fa-pencil fa-3x',
  deleteButtonContent: '',
  deleteButtonStyleClass: 'fa fa-trash fa-3x',
  //distance and time buttons
  distanceButtonContent: '',
  distanceButtonStyleClass: 'fa fa-road fa-3x',
  timeButtonContent: '',
  timeButtonStyleClass: 'fa fa-clock-o fa-3x',
  //travel mode buttons
  travelModeButton1Content: '',
  travelModeButton1StyleClass: 'fa fa-car fa-2x',
  travelModeButton1Tooltip: 'Auto',
  travelModeProfile1: 'driving-car',

  travelModeButton2Content: '',
  travelModeButton2StyleClass: 'fa fa-bicycle fa-2x',
  travelModeButton2Tooltip: 'Fahrrad',
  travelModeProfile2: 'cycling-regular',

  travelModeButton3Content: '',
  travelModeButton3StyleClass: 'fa fa-street-view fa-2x',
  travelModeButton3Tooltip: 'Zu Fuß',
  travelModeProfile3: 'foot-walking',

  travelModeButton4Content: '',
  travelModeButton4StyleClass: 'fa fa-bus fa-2x',
  travelModeButton4Tooltip: 'ÖPNV',
  travelModeProfile4: 'driving-hgv',

  rangeControlDistanceTitle: null,

  showOriginMarker: true,

}).addTo(map);



//#Geocoder#############################################################################################
//Esri Leaflet Geocoder
let searchControl = L.esri.Geocoding.geosearch().addTo(map);

let results = L.layerGroup().addTo(map);
//Geocoder minimal
searchControl.on('results', function (data) {
  results.clearLayers();
  for (let i = data.results.length - 1; i >= 0; i--) {
    results.addLayer(L.marker(data.results[i].latlng));
  }
});



//Test Zugriff auf Polygon Data
map.on('reachability:displayed', function (e) {
  let checkYourRange
  // Iterate through the reachability polygons just created, binding a popup to each one
  reachabilityControl.latestIsolines.eachLayer(function (layer) {
    // Ensure we only bind popups to the polygons and not the origin marker
    // Marker layers don't have the 'feature' property
    if (layer.hasOwnProperty('feature')) {
      checkYourRange = layer.feature.properties;
      
      let mapInfoLat = checkYourRange['Latitude'];
      let mapInfoLng = checkYourRange['Longitude'];
    
    }
  });
});