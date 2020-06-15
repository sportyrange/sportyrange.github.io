let startLayer = L.tileLayer.provider("BasemapAT.grau");

let map = L.map("map", {
    center: [47.265518, 11.397954],
    zoom: 13,
    layers: [
        startLayer
    ]
});

let overlay = {
    SPIELPLAETZE: L.featureGroup(),
    SPORTSTAETTE: L.featureGroup(),
    TRINKBRUNNEN: L.featureGroup()
};

L.control.layers({
    "BasemapAT.grau": L.tileLayer.provider("BasemapAT.grau"),
    "BasemapAT": L.tileLayer.provider("BasemapAT"),
}, {
    "SPIELPLAETZE": overlay.SPIELPLAETZE,
    "SPORTSTAETTE": overlay.SPORTSTAETTE,
    "TRINKBRUNNEN": overlay.TRINKBRUNNEN
}).addTo(map);

let RadRouten = "https://opendata.arcgis.com/datasets/4810ee4141d14e90ae42582260f44df0_0.geojson?where=%20(BEZIRK_REGION%20%3D%20'Innsbruck%2C%20Ibk%20Land'%20OR%20BEZIRK_REGION%20%3D%20'%C3%9Cberregionaler%20Radweg')%20"

L.geoJson.ajax(RadRouten, {
    style: function (feature) {
        if (feature.properties.SCHWIERIGKEITSGRAD == "leicht") {
            return {
                color: "#24a148",
                // width: "auto"
            };
        } else if (feature.properties.SCHWIERIGKEITSGRAD == "mittelschwierig") {
            return {
                color: "#f1c21b",
                // dashArray: "7, 7"
            };
        } else if (feature.properties.SCHWIERIGKEITSGRAD == "schwierig") {
            return {
                color: "#da1e28",
                // dashArray: "7, 7"
            };
        };
    },
    onEachFeature: function (feature, layer) {
        layer.bindPopup(`<p>${feature.properties.ROUTENNAME}</p>`);
    },
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
        layer.bindPopup(`<p>${feature.properties.ROUTENNAME}</p>`);
    },
}).addTo(map);

for (const plaetze of SPIELPLAETZE) {
    console.log(plaetze.Typ);
    let type = plaetze.Typ
    let marker_icon
    switch (type) {
        case "Spielplatz":
            marker_icon = "icon/pin.png";
            break;
        case "Ballspielplatz":
            marker_icon = "icon/gps.png";
            break;
        case "Skateplatz":
            marker_icon = "icon/gps (1).png";
            break;
        default:
            marker_icon = "icon/pin.png";
    }
    let mrk = L.marker([plaetze.Lat, plaetze.Lon], {
        icon: L.icon({
            iconUrl: marker_icon,

            iconSize: [32, 37],
            iconAnchor: [16, 37],
            popupAnchor: [0, -37],
        })
    }).addTo(overlay.SPIELPLAETZE);

    mrk.bindPopup(`<b>${plaetze.Anlage}</b> (${plaetze.Typ}) <p><a target="link" href="${plaetze.Link}">Info</a></p>`);
}

for (const staette of SPORTSTAETTE) {
    let mrk = L.marker([staette.Lat, staette.Lon], {
        icon: L.icon({
            iconSize: [32, 37],
            iconAnchor: [16, 37],
            popupAnchor: [0, -37],
            iconUrl: "icon/pin.png"
        })
    }).addTo(overlay.SPORTSTAETTE);
}

for (const trink of TRINKBRUNNEN) {
    let mrk = L.marker([trink.Lat, trink.Lon], {}).addTo(overlay.TRINKBRUNNEN);
}