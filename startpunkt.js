//#
//#Map################################################################################################
//#
//Add map and define map center and zoom level
let searchMap = L.map("searchMap").setView([47.263353, 11.400533], 13);
//######################################################################################################


//# 
//#Leaflet tile layer###################################################################################
//# 
// Create a Leaflet tile layer object
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(searchMap);
//######################################################################################################


//#
//#Reachability#########################################################################################
//#
//Function to return a colour based on the 'Range' value of the reachability polygons
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

//Function to style the reachability polygons
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

//Polygon popup
// Listen for the event fired when reachability areas are created on the map
searchMap.on('reachability:displayed', function (e) {
  let properties,
    content;

  // Iterate through the reachability polygons just created, binding a popup to each one
  reachabilityControl.latestIsolines.eachLayer(function (layer) {
    // Ensure to only bind popups to the polygons and not the origin marker
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

  //rangeControlDistanceTitle: null,

  //Marker at the origin of a reachability polygon is displayed
  showOriginMarker: true,

}).addTo(searchMap);

//#### Test ####
//reachabilityControl.addTo(map)

//#### Test ####
//Get reachability polygon informaion
searchMap.on('reachability:displayed', function (e) {
  let checkYourRange
  //Iterate through the reachability polygons just created, binding a popup to each one
  reachabilityControl.latestIsolines.eachLayer(function (layer) {
    //Ensure we only bind popups to the polygons and not the origin marker
    //Marker layers don't have the 'feature' property

    if (layer.hasOwnProperty('feature')) {
      checkYourRange = layer.feature.properties;

      mapInfoLat = checkYourRange['Latitude'];
      mapInfoLng = checkYourRange['Longitude'];
    }
  });
});
//######################################################################################################


//# 
//#Geocoder#############################################################################################
//# 
//Esri Leaflet Geocoder
let searchControl = L.esri.Geocoding.geosearch().addTo(searchMap);

let results = L.layerGroup().addTo(searchMap);
//Geocoder minimal
searchControl.on('results', function (data) {
  results.clearLayers();
  for (let i = data.results.length - 1; i >= 0; i--) {
    results.addLayer(L.marker(data.results[i].latlng));
  }
});
//######################################################################################################


//#
//#Legend###############################################################################################
//#
//Add legend to bottom right
let legend = L.control({
  position: 'bottomright'
});

legend.onAdd = function (searchMap) {
  //Create empty HTML-Element
  let div = L.DomUtil.create('div', 'legend');
  div.innerHTML += "<h5>Polygon Farblegende</h5>";
  //Threshold values
  let lables = [];
  let ranges = [5, 10, 15, 20, 25, 30];
  //Add label caption
  for (var i = 0; i < ranges.length; i++) {
    div.innerHTML +=
      '<i style="background:' + getColourByRange(ranges[i]) + '"></i> ' + ranges[i] + '<span> min / </span>' + ranges[i] / 10 + '<span> km </span>' + '<br>'
  }

  return div;
};
legend.addTo(searchMap);
//######################################################################################################


//#
//#Scale##############################################################################################
//#
//Add scale to map
L.control.scale().addTo(searchMap);
//Define scale intervals and timeouts
//Set scale view center
setInterval(function () {
  searchMap.setView([47.263353, 11.400533]);
  setTimeout(function () {
    searchMap.setView([47.263353, 11.400533]);
  }, 2000); //min. timeout 2s
}, 20000);
//######################################################################################################



//######################################################################################################################################################################################################################

//#
//#Kopie sportakti.js##################################################################################
//# 

let overlay = {
  RADROUTEN: L.featureGroup(),
  SPIELPLAETZE: L.featureGroup(),
  SPORTSTAETTE: L.featureGroup(),
  TRINKBRUNNEN: L.featureGroup()
};

L.control.layers({}, {
  "Rad Routen": overlay.RADROUTEN,
  "Spielplätze": overlay.SPIELPLAETZE,
  "Sportstätte": overlay.SPORTSTAETTE,
  "Trinkbrunnen": overlay.TRINKBRUNNEN
}).addTo(searchMap);

let RadRouten = "https://opendata.arcgis.com/datasets/4810ee4141d14e90ae42582260f44df0_0.geojson?where=%20(BEZIRK_REGION%20%3D%20'Innsbruck%2C%20Ibk%20Land'%20OR%20BEZIRK_REGION%20%3D%20'%C3%9Cberregionaler%20Radweg')%20"
L.geoJson.ajax(RadRouten, {
  style: function (feature) {
    if (feature.properties.SCHWIERIGKEITSGRAD == "leicht") {
      return {
        color: "#24a148",
      };
    } else if (feature.properties.SCHWIERIGKEITSGRAD == "mittelschwierig") {
      return {
        color: "#f1c21b",
      };
    } else if (feature.properties.SCHWIERIGKEITSGRAD == "schwierig") {
      return {
        color: "#da1e28",
      };
    };
  },
  onEachFeature: function (feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.ROUTENNAME}</h3> <p>Länge ${feature.properties.LAENGE_HAUPTROUTE_KM}km - Fahrzeit ${feature.properties.FAHRZEIT}</p>`);
    //${feature.properties.ROUTENBESCHREIBUNG}
  },
}).addTo(overlay.RADROUTEN);

var markers_SP = L.markerClusterGroup().addTo(overlay.SPIELPLAETZE);
for (const plaetze of SPIELPLAETZE) {
  let type = plaetze.Typ
  let marker_icon
  switch (type) {
    case "Spielplatz":
      marker_icon = "icons/Spiel.svg";
      break;
    case "Ballspielplatz":
      marker_icon = "icons/Ball.svg";
      break;
    case "Skateplatz":
      marker_icon = "icons/Skate.svg";
      break;
    default:
      marker_icon = "icons/Liegewiese.svg";
  }
  let mrk = L.marker([plaetze.Lat, plaetze.Lon], {
    icon: L.icon({
      iconUrl: marker_icon,
      iconSize: [32, 37],
      iconAnchor: [16, 37],
      popupAnchor: [0, -37],
    })
  })
  mrk.bindPopup(`<b>${plaetze.Anlage}</b> (${plaetze.Typ}) <p><a target="link" href="${plaetze.Link}">Info</a></p>`);
  markers_SP.addLayer(mrk);
}

var markers_ST = L.markerClusterGroup().addTo(overlay.SPORTSTAETTE);
for (const staette of SPORTSTAETTE) {
  let group = staette.Gruppe
  let marker_icon
  switch (group) {
    case "Eissport":
      marker_icon = "icons/Eissport.svg";
      break;
    case "Fitness/Klettern":
      marker_icon = "icons/FitnessKlettern.svg";
      break;
    case "Funsport":
      marker_icon = "icons/Funsport.svg";
      break;
    case "Fußball/Football":
      marker_icon = "icons/FussballFootball.svg";
      break;
    case "Golf/Minigolf":
      marker_icon = "icons/GolfMinigolf.svg";
      break;
    case "Schwimmen":
      marker_icon = "icons/Schwimmen.svg";
      break;
    case "Spielplatz":
      marker_icon = "icons/Spielplatz.svg";
      break;
    case "Sporthalle":
      marker_icon = "icons/Sporthalle.svg";
      break;
    case "Tennis/Squash":
      marker_icon = "icons/TennisSquash.svg";
      break;
    case "Wintersport":
      marker_icon = "icons/Wintersport.svg";
      break;
    default:
      marker_icon = "icons/Sontiges.svg";
  }
  let mrk = L.marker([staette.Lat, staette.Lon], {
    icon: L.icon({
      iconUrl: marker_icon,
      iconSize: [32, 37],
      iconAnchor: [16, 37],
      popupAnchor: [0, -37],
    })
  })
  mrk.bindPopup(`<b>${staette.Anlage}</b> (${staette.Typ})`);
  markers_ST.addLayer(mrk);
}

var markers_T = L.markerClusterGroup().addTo(overlay.TRINKBRUNNEN);
for (const trink of TRINKBRUNNEN) {
  let mrk = L.marker([trink.Lat, trink.Lon], {
    icon: L.icon({
      iconSize: [32, 37],
      iconAnchor: [16, 37],
      popupAnchor: [0, -37],
      iconUrl: "icons/Trink.svg",
    })
  })
  mrk.bindPopup(`<b>${trink.Bezeichnung}</b>`);
  markers_T.addLayer(mrk);
}