let startLayer = L.tileLayer.provider("BasemapAT.grau");

let map = L.map("map", {
    center: [47.265518, 11.397954],
    zoom: 13,
    layers: [
        startLayer
    ]
});

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
}).addTo(map);

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